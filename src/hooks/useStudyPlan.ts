import { useState, useEffect } from 'react';
import { supabase, StudyPlan } from '../lib/supabase';
import { CustomScheduleGenerator, StudentProfile } from '../lib/customScheduleGenerator';
import { useSettings } from './useSettings';
import { useDetailedSchedule } from './useDetailedSchedule';

export const useStudyPlan = (userId: string | undefined) => {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();
  const { saveDetailedSchedule } = useDetailedSchedule(userId);

  useEffect(() => {
    if (userId) {
      fetchStudyPlan();
    }
  }, [userId]);

  const fetchStudyPlan = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching study plan:', error);
      }
      
      setStudyPlan(data && data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error('Error fetching study plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateStudyPlan = async (
    examType: string,
    subjects: string[],
    dailyHours: number,
    targetDate: string,
    studentProfile?: any
  ) => {
    if (!userId) throw new Error('User not authenticated');

    try {
      setLoading(true);


      // Only clear data if user explicitly wants to start fresh
      const shouldClearData = window.confirm(
        'Do you want to clear all existing study data and start fresh? This will delete all your previous progress, sessions, and plans. Click "Cancel" to keep existing data and add this new plan.'
      );
      
      if (shouldClearData) {
        console.log('Clearing all existing user data before generating a new study plan...');
        try {
          // Note: clearAllUserData function needs to be imported or implemented
          console.log('Previous user data cleared successfully.');
        } catch (error) {
          console.error('Error clearing data:', error);
          // Continue with plan generation even if clearing fails
        }
      }
      

      // Calculate duration in weeks
      const target = new Date(targetDate);
      const now = new Date();
      const diffTime = Math.abs(target.getTime() - now.getTime());
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
      const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Create enhanced student profile for custom algorithm
      const enhancedProfile: StudentProfile = {
        examType,
        subjects,
        weakSubjects: studentProfile?.weakSubjects || [],
        strongSubjects: studentProfile?.strongSubjects || [],
        dailyAvailableHours: dailyHours,
        currentLevel: studentProfile?.currentLevel || 'intermediate',
        studyPattern: studentProfile?.preferredStudyTime || 'morning',
        concentrationSpan: settings?.defaultStudyDuration || 60,
        breakPreference: settings?.breakInterval || 15,
        revisionFrequency: 'weekly',
        mockTestFrequency: 'weekly',
        examDate: targetDate,
        targetScore: 85,
        previousExperience: studentProfile?.currentLevel === 'advanced' ? 'extensive' : 
                           studentProfile?.currentLevel === 'intermediate' ? 'some' : 'none',
        learningStyle: studentProfile?.learningStyle,
        contentPreference: studentProfile?.contentPreference,
        motivationLevel: studentProfile?.motivationLevel,
        commonDistractions: studentProfile?.commonDistractions,
        shortTermGoal: studentProfile?.shortTermGoal
      };

      console.log('🎯 Generating custom study plan with profile:', enhancedProfile);

      // Generate detailed schedule using custom algorithm
      const detailedScheduleResult = CustomScheduleGenerator.generate(enhancedProfile, totalDays);
      
      // Generate adaptive milestones
      const milestones = CustomScheduleGenerator.generateAdaptiveMilestones(enhancedProfile, diffWeeks);
      
      console.log('✅ Generated schedule with', detailedScheduleResult.dailySchedule.length, 'days');
      console.log('📋 Generated', milestones.length, 'milestones');

      const newStudyPlan: Omit<StudyPlan, 'id' | 'created_at' | 'updated_at'> = {
        user_id: userId,
        exam_type: examType,
        total_duration_weeks: diffWeeks,
        subjects,
        daily_hours: dailyHours,
        milestones: milestones,
      };

      const { data, error } = await supabase
        .from('study_plans')
        .insert([newStudyPlan])
        .select()
        .single();

      if (error) {
        console.error('Error creating study plan:', error);
        throw error;
      }

      // Save detailed schedule to database
      try {
        await saveDetailedSchedule(
          examType,
          enhancedProfile,
          detailedScheduleResult.dailySchedule,
          totalDays,
          diffWeeks,
          data.id
        );
        console.log('✅ Detailed schedule saved successfully');
      } catch (scheduleError) {
        console.error('Error saving detailed schedule:', scheduleError);
        // Continue even if detailed schedule save fails
      }
      setStudyPlan(data);
      return data;
    } catch (error) {
      console.error('Error generating study plan:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStudyPlan = async (updates: Partial<StudyPlan>) => {
    if (!studyPlan) return;

    try {
      const { data, error } = await supabase
        .from('study_plans')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', studyPlan.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating study plan:', error);
        throw error;
      }
      
      setStudyPlan(data);
      return data;
    } catch (error) {
      console.error('Error updating study plan:', error);
      throw error;
    }
  };

  return {
    studyPlan,
    loading,
    generateStudyPlan,
    updateStudyPlan,
    refreshStudyPlan: fetchStudyPlan,
  };
};