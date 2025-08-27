// src/hooks/useProgress.ts
import { useState, useEffect, useCallback, useRef } from 'react'; // Import useRef
import { supabase, StudySession, ProgressReport, DetailedSchedule } from '../lib/supabase';
import { AIService } from '../lib/mistralAI';
import { safeParseJSON } from '../utils/jsonParser';
import { CustomScheduleGenerator } from '../lib/customScheduleGenerator';

// Define a minimum interval for AI analysis calls (e.g., 60 minutes)
const MIN_AI_ANALYSIS_INTERVAL_MS = 60 * 60 * 1000;
// Define a debounce delay for triggering AI analysis (e.g., 1 second)
const AI_ANALYSIS_DEBOUNCE_DELAY_MS = 2000;

export const useProgress = (
  userId: string | undefined,
  detailedSchedule: DetailedSchedule | null,
  detailedScheduleLoading: boolean
) => {
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [progressReports, setProgressReports] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(true);
  // Use a ref to store the last timestamp of AI analysis
  const lastAIAnalysisTimestamp = useRef(0);
  // Use a ref for the debounce timer
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (userId) {
      fetchProgressData();
    }
  }, [userId]);

  // Helper function for better topic matching (moved inside useProgress to be a stable reference)
  const hasSignificantOverlap = useCallback((text1: string, text2: string): boolean => {
    const words1 = text1.split(/\s+/).filter(word => word.length > 2);
    const words2 = text2.split(/\s+/).filter(word => word.length > 2);

    if (words1.length === 0 || words2.length === 0) return false;

    const commonWords = words1.filter(word =>
      words2.some(w => w.includes(word) || word.includes(w))
    );

    return commonWords.length >= Math.min(words1.length, words2.length) * 0.5;
  }, []); // No dependencies, as it's a pure function

  const analyzeAndUpdateProgress = useCallback(async () => {
    console.log('analyzeAndUpdateProgress called.');
    console.log('detailedSchedule:', detailedSchedule);
    console.log('detailedScheduleLoading:', detailedScheduleLoading);

    if (!userId || studySessions.length === 0) {
      console.log('analyzeAndUpdateProgress returning early due to no user or no study sessions.');
      return;
    }

    // --- Rate Limit Control ---
    const currentTime = Date.now();
    if (currentTime - lastAIAnalysisTimestamp.current < MIN_AI_ANALYSIS_INTERVAL_MS) {
      console.log('AI analysis throttled. Too soon since last call.');
      return; // Return early if too soon
    }
    // --- End Rate Limit Control ---

    // Collect all subjects from study sessions
    const allSubjects = new Set<string>();
    const subjectGroups: Record<string, StudySession[]> = {};
    studySessions.forEach(session => {
      allSubjects.add(session.subject);
      if (!subjectGroups[session.subject]) {
        subjectGroups[session.subject] = [];
      }
      subjectGroups[session.subject].push(session);
    });

    // Collect all scheduled topics from detailed schedule if available
    const allScheduledTopics: Record<string, Set<string>> = {};
    if (detailedSchedule && detailedSchedule.daily_schedule) {
      const dailyScheduleArray = Array.isArray(detailedSchedule.daily_schedule)
        ? detailedSchedule.daily_schedule
        : [];

      dailyScheduleArray.forEach((daySchedule: any) => {
        if (daySchedule.subjects && Array.isArray(daySchedule.subjects)) {
          daySchedule.subjects.forEach((subj: any) => {
            if (subj.subject && subj.topics && Array.isArray(subj.topics)) {
              if (!allScheduledTopics[subj.subject]) {
                allScheduledTopics[subj.subject] = new Set<string>();
              }
              subj.topics.forEach((topic: string) => {
                if (topic && topic.trim()) {
                  const cleanTopic = topic.trim();
                  // Only add the full, clean topic string
                  allScheduledTopics[subj.subject].add(cleanTopic);
                  // REMOVED: Logic to add simplifiedTopic and keywords, which caused topic count inflation
                  // const simplifiedTopic = cleanTopic.replace(/^[^-]*-\s*/, '').trim();
                  // if (simplifiedTopic !== cleanTopic) {
                  //   allScheduledTopics[subj.subject].add(simplifiedTopic);
                  // }
                  // const keywords = cleanTopic.split(/[\s\-&,]+/).filter(word => word.length > 3);
                  // keywords.forEach(keyword => {
                  //   allScheduledTopics[subj.subject].add(keyword);
                  // });
                }
              });
            }
          });
        }
      });
    }

    try {
      // Update the timestamp before making the AI call
      lastAIAnalysisTimestamp.current = currentTime;

      // Use AI to analyze progress (this part remains the same)
      const currentWeek = Math.ceil(studySessions.length / 7); // Simplified current week
      const analysisResult = await AIService.analyzeProgress(studySessions, currentWeek);
      const analysis = safeParseJSON<{
        weakAreas: string[];
        strongAreas: string[];
        recommendations: string[];
      }>(analysisResult);

      // Determine AI analysis to use (fallback if parsing fails)
      const finalAnalysis = analysis || {
        weakAreas: ['General Practice'],
        strongAreas: ['Consistency'],
        recommendations: ['Keep up the good work', 'Focus on weak areas']
      };

      const updatedProgressReports: ProgressReport[] = [];

      for (const subject of allSubjects) {
        console.log('--- Processing Subject:', subject, '---');

        const sessions = subjectGroups[subject] || [];
        const scheduledTopics = allScheduledTopics[subject] || new Set();
        const totalUnitsForSubject = scheduledTopics.size;

        console.log('Scheduled topics for', subject, ':', Array.from(scheduledTopics));
        console.log('Study sessions for', subject, ':', sessions.length);

        const completedScheduledTopics = new Set<string>();

        if (scheduledTopics.size > 0) {
          scheduledTopics.forEach(scheduledTopic => {
            const lowerScheduledTopic = scheduledTopic.toLowerCase();
            const isTopicCompleted = sessions.some(session => {
              if (!session.topics_covered || session.topics_covered.length === 0) {
                return false;
              }
              return session.topics_covered.some(coveredTopic => {
                const lowerCoveredTopic = coveredTopic.toLowerCase();
                return (
                  lowerCoveredTopic === lowerScheduledTopic ||
                  lowerCoveredTopic.includes(lowerScheduledTopic) ||
                  lowerScheduledTopic.includes(lowerCoveredTopic) ||
                  hasSignificantOverlap(lowerCoveredTopic, lowerScheduledTopic)
                );
              });
            });
            if (isTopicCompleted) {
              completedScheduledTopics.add(scheduledTopic);
            }
          });
        }

        let completionPercentage = 0;

        if (totalUnitsForSubject > 0) {
          completionPercentage = Math.min(100, Math.round((completedScheduledTopics.size / totalUnitsForSubject) * 100));
          console.log(`${subject}: ${completedScheduledTopics.size}/${totalUnitsForSubject} topics completed = ${completionPercentage}%`);
        } else if (sessions.length > 0) {
          const totalMinutesStudied = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
          const totalHoursStudied = totalMinutesStudied / 60;

          if (totalHoursStudied >= 20) {
            completionPercentage = 100;
          } else if (totalHoursStudied >= 15) {
            completionPercentage = 85;
          } else if (totalHoursStudied >= 10) {
            completionPercentage = 70;
          } else if (totalHoursStudied >= 5) {
            completionPercentage = 50;
          } else if (totalHoursStudied >= 2) {
            completionPercentage = 25;
          } else if (totalHoursStudied > 0) {
            completionPercentage = Math.max(5, Math.round(totalHoursStudied * 5));
          }
          console.log(`${subject}: Time-based calculation - ${totalHoursStudied}h studied = ${completionPercentage}%`);
        }

        const avgPerformance = sessions.length > 0
          ? sessions.reduce((sum, s) => sum + s.performance_score, 0) / sessions.length
          : 0;

        const totalStudyTime = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);

        // Dynamic strong and weak areas based on AI analysis and local data
        const subjectWeakAreas = finalAnalysis.weakAreas.filter(area => area.toLowerCase().includes(subject.toLowerCase()));
        const subjectStrongAreas = finalAnalysis.strongAreas.filter(area => area.toLowerCase().includes(subject.toLowerCase()));
        const subjectRecommendations = finalAnalysis.recommendations.filter(rec => rec.toLowerCase().includes(subject.toLowerCase()));

        // Add general weak/strong areas if subject-specific ones are not found
        if (subjectWeakAreas.length === 0 && completionPercentage < 100) {
          subjectWeakAreas.push(`Needs more focus in ${subject}`);
        }
        if (subjectStrongAreas.length === 0 && completionPercentage > 0) {
          subjectStrongAreas.push(`Good start in ${subject}`);
        }

        const progressReport: Omit<ProgressReport, 'id'> = {
          user_id: userId,
          subject,
          completion_percentage: completionPercentage,
          weak_areas: subjectWeakAreas,
          strong_areas: subjectStrongAreas,
          recommendations: subjectRecommendations,
          last_updated: new Date().toISOString(),
        };

        updatedProgressReports.push(progressReport);
      }

      // Upsert all progress reports in a single batch
      if (updatedProgressReports.length > 0) {
        const { error: upsertError } = await supabase
          .from('progress_reports')
          .upsert(updatedProgressReports, {
            onConflict: 'user_id,subject',
            ignoreDuplicates: false
          });

        if (upsertError) {
          console.error('Error upserting progress reports:', upsertError);
        } else {
          console.log('Progress reports upserted successfully.');
          // Refresh local state after successful upsert
          await fetchProgressData();
        }
      }
    } catch (error) {
      console.error('Error analyzing progress:', error);
      // Reset timestamp if AI call failed due to rate limit or other issues
      // but prevents immediate re-attempts in a loop.
      lastAIAnalysisTimestamp.current = 0;
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  }, [userId, detailedSchedule, detailedScheduleLoading, studySessions, setProgressReports, setLoading, hasSignificantOverlap]);


  useEffect(() => {
    if (userId) {
      fetchProgressData();
    }
  }, [userId, detailedSchedule, detailedScheduleLoading]);

  const fetchProgressData = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Fetch study sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
      }

      // Fetch progress reports
      const { data: reports, error: reportsError } = await supabase
        .from('progress_reports')
        .select('*')
        .eq('user_id', userId)
        .order('last_updated', { ascending: false });

      if (reportsError) {
        console.error('Error fetching reports:', reportsError);
      }

      setStudySessions(sessions || []);
      setProgressReports(reports || []);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };


   const addStudySession = async (session: Omit<StudySession, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert([{
          ...session,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding study session:', error);
        throw error;
      }

      setStudySessions(prev => [data, ...prev]);

      // Trigger progress analysis after adding session with debounce
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        analyzeAndUpdateProgress();
      }, AI_ANALYSIS_DEBOUNCE_DELAY_MS);

      return data;
    } catch (error) {
      console.error('Error adding study session:', error);
      throw error;
    }
  };


  // This useEffect will trigger progress analysis when studySessions change
  // with a debounce to prevent rapid calls and an internal throttle for AI API.
  useEffect(() => {
    if (userId && !detailedScheduleLoading && studySessions.length > 0) {
      // Clear any existing debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set a new debounce timer
      debounceTimer.current = setTimeout(() => {
        analyzeAndUpdateProgress();
      }, AI_ANALYSIS_DEBOUNCE_DELAY_MS);
    }

    // Cleanup function to clear the timer if the component unmounts or dependencies change
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [userId, detailedSchedule, detailedScheduleLoading, studySessions, analyzeAndUpdateProgress]); // studySessions as a dependency will trigger on array reference change

  const getSubjectProgress = (subject: string) => {
    return progressReports.find(report => report.subject === subject);
  };

  const getOverallProgress = () => {
    if (progressReports.length === 0) return 0;

    const validReports = progressReports.filter(r =>
      r.completion_percentage !== null && r.completion_percentage !== undefined
    );

    if (validReports.length === 0) return 0;

    const totalProgress = validReports.reduce(
      (sum, report) => sum + report.completion_percentage,
      0
    );

    return Math.round(totalProgress / validReports.length);
  };

  const getWeeklyStudyHours = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weekSessions = studySessions.filter(
      session => new Date(session.created_at) >= weekAgo
    );

    return Math.round((weekSessions.reduce((total, session) => total + session.duration_minutes, 0) / 60) * 100) / 100;
  };

  const getTotalStudyHours = () => {
    return Math.round((studySessions.reduce((total, session) => total + session.duration_minutes, 0) / 60) * 100) / 100;
  };

  const getAveragePerformance = () => {
    if (studySessions.length === 0) return 0;
    const totalScore = studySessions.reduce((sum, session) => sum + session.performance_score, 0);
    return Math.round((totalScore / studySessions.length) * 100) / 100;
  };

  const getSuccessProbability = (): number => {
    if (studySessions.length === 0 || !detailedSchedule) return 50;
    
    // Calculate schedule adherence
    const plannedDays = detailedSchedule?.daily_schedule?.length || 0;
    const studiedDays = new Set(studySessions.map(s => s.created_at.split('T')[0])).size;
    const scheduleAdherence = plannedDays > 0 ? (studiedDays / plannedDays) * 100 : 0;
    
    // Calculate current progress
    const currentProgress = getOverallProgress();
    
    // Use custom algorithm to calculate success probability
    const studentProfile = {
      examType: detailedSchedule?.exam_type || '',
      subjects: detailedSchedule?.student_profile?.subjects || [],
      weakSubjects: detailedSchedule?.student_profile?.weakSubjects || [],
      strongSubjects: detailedSchedule?.student_profile?.strongSubjects || [],
      dailyAvailableHours: detailedSchedule?.student_profile?.dailyAvailableHours || 6,
      currentLevel: detailedSchedule?.student_profile?.currentLevel || 'intermediate',
      studyPattern: detailedSchedule?.student_profile?.studyPattern || 'morning',
      concentrationSpan: 60,
      breakPreference: 15,
      revisionFrequency: 'weekly' as const,
      mockTestFrequency: 'weekly' as const,
      examDate: detailedSchedule?.student_profile?.examDate || '',
      targetScore: 85,
      previousExperience: 'some' as const,
      motivationLevel: detailedSchedule?.student_profile?.motivationLevel
    };
    
    return CustomScheduleGenerator.calculateSuccessProbability(
      studentProfile,
      scheduleAdherence,
      currentProgress
    );
  };

  return {
    studySessions,
    progressReports,
    loading,
    addStudySession,
    analyzeAndUpdateProgress,
    getSubjectProgress,
    getOverallProgress,
    getWeeklyStudyHours,
    getTotalStudyHours,
    getAveragePerformance,
    refreshProgress: fetchProgressData,
  };
};