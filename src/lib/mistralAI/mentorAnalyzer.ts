import { supabase } from '../supabase';

export interface ComprehensiveUserProfile {
  // Basic Info
  userId: string;
  targetExam: string;
  studyDuration: number; // days since started
  
  // Study Sessions Analysis
  totalStudySessions: number;
  totalStudyHours: number;
  averageSessionDuration: number;
  studyConsistency: number; // percentage of days studied
  currentStreak: number;
  longestStreak: number;
  
  // Subject Performance
  subjectPerformance: {
    subject: string;
    totalHours: number;
    sessionsCount: number;
    averageScore: number;
    completionPercentage: number;
    topicsStudied: string[];
    topicsMastered: string[];
    weakAreas: string[];
    strongAreas: string[];
    lastStudied: string;
    improvementTrend: 'improving' | 'stable' | 'declining';
  }[];
  
  // Daily Study Patterns
  studyPatterns: {
    preferredTimeSlots: string[];
    averageDailyHours: number;
    peakPerformanceTime: string;
    consistencyByDayOfWeek: Record<string, number>;
    monthlyTrends: {
      month: string;
      hoursStudied: number;
      averageScore: number;
      topicsCompleted: number;
    }[];
  };
  
  // Quiz & Assessment Performance
  assessmentData: {
    totalQuizzes: number;
    averageQuizScore: number;
    bestScore: number;
    worstScore: number;
    improvementRate: number;
    difficultyPreference: string;
    timeManagement: 'excellent' | 'good' | 'needs_improvement';
    accuracyTrend: 'improving' | 'stable' | 'declining';
    quizAttempts: QuizAttempt[]; // NEW: Store raw quiz attempts
  };
  
  // Learning Velocity & Efficiency
  learningMetrics: {
    conceptsLearnedPerHour: number;
    retentionRate: number;
    revisionEfficiency: number;
    weaknessImprovementRate: number;
    strengthMaintenanceRate: number;
    theoryStudyHours: number; 
  };
  
  // Schedule Adherence
  scheduleAdherence: {
    plannedVsActualHours: number;
    missedSessions: number;
    completedMilestones: number;
    totalMilestones: number;
    scheduleEffectiveness: number;
     missedScheduledSessions: { date: string; dayOfWeek: string; subject: string; topics: string[] }[]; // NEW: Detailed missed sessions
  };
  
  // Uploaded Materials Analysis
  materialsAnalysis: {
    totalMaterialsUploaded: number;
    averageRelevanceScore: number;
    topicsExtracted: string[];
    contentTypes: string[];
    utilizationRate: number; // how much uploaded content is actually studied
  };
  
  // Mistake Patterns
  mistakeAnalysis: {
    commonMistakeTypes: string[];
    repeatedMistakes: number;
    conceptualGaps: string[];
    improvementAreas: string[];
    mistakeResolutionRate: number;
  };
  
  // Goal Achievement
  goalTracking: {
    weeklyGoalsSet: number;
    weeklyGoalsAchieved: number;
    monthlyTargets: any[];
    examReadiness: number; // percentage
    confidenceLevel: number;
  };
}

export class MentorAnalyzer {
  static async generateComprehensiveProfile(userId: string): Promise<ComprehensiveUserProfile> {
    try {
      // Fetch all user data in parallel for efficiency
      const [
        userData,
        studySessions,
        progressReports,
        studyPlans,
        detailedSchedules,
        weeklyAssessments,
        uploadedMaterials,
        userSettings,
        subjectProgress,
        quizAttempts,
        topicMastery,
        learningAnalytics,
        mistakeTracking,
        studyMilestones,
         theoryStudyLogs, // NEW
      ] = await Promise.all([
        this.fetchUserData(userId),
        this.fetchStudySessions(userId),
        this.fetchProgressReports(userId),
        this.fetchStudyPlans(userId),
        this.fetchDetailedSchedules(userId),
        this.fetchWeeklyAssessments(userId),
        this.fetchUploadedMaterials(userId),
        this.fetchUserSettings(userId),
        this.fetchSubjectProgress(userId),
        this.fetchQuizAttempts(userId),
        this.fetchTopicMastery(userId),
        this.fetchLearningAnalytics(userId),
        this.fetchMistakeTracking(userId),
        this.fetchStudyMilestones(userId),
        this.fetchTheoryStudyLogs(userId),
      ]);

      // Calculate comprehensive metrics
      const profile = await this.calculateComprehensiveMetrics({
        userData,
        studySessions,
        progressReports,
        studyPlans,
        detailedSchedules,
        weeklyAssessments,
        uploadedMaterials,
        userSettings,
        subjectProgress,
        quizAttempts,
        topicMastery,
        learningAnalytics,
        mistakeTracking,
        studyMilestones,
        theoryStudyLogs,
      });

      return profile;
    } catch (error) {
      console.error('Error generating comprehensive profile:', error);
      throw error;
    }
  }

  private static async fetchUserData(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  private static async fetchStudySessions(userId: string) {
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  private static async fetchProgressReports(userId: string) {
    const { data, error } = await supabase
      .from('progress_reports')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  }

  private static async fetchStudyPlans(userId: string) {
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  private static async fetchDetailedSchedules(userId: string) {
    const { data, error } = await supabase
      .from('detailed_schedules')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  private static async fetchWeeklyAssessments(userId: string) {
    const { data, error } = await supabase
      .from('weekly_assessments')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  private static async fetchUploadedMaterials(userId: string) {
    const { data, error } = await supabase
      .from('uploaded_materials')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  }

  private static async fetchUserSettings(userId: string) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  private static async fetchSubjectProgress(userId: string) {
    const { data, error } = await supabase
      .from('subject_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  }

  private static async fetchQuizAttempts(userId: string) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  private static async fetchTopicMastery(userId: string) {
    const { data, error } = await supabase
      .from('topic_mastery')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  }

  private static async fetchLearningAnalytics(userId: string) {
    const { data, error } = await supabase
      .from('learning_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('analytics_date', { ascending: false })
      .limit(30); // Last 30 days
    
    if (error) throw error;
    return data || [];
  }

  private static async fetchMistakeTracking(userId: string) {
    const { data, error } = await supabase
      .from('mistake_tracking')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  private static async fetchStudyMilestones(userId: string) {
    const { data, error } = await supabase
      .from('study_milestones')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  }

   private static async fetchTheoryStudyLogs(userId: string): Promise<TheoryStudyLog[]> {
    const { data, error } = await supabase
      .from('theory_study_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // private static async calculateComprehensiveMetrics(data: any): Promise<ComprehensiveUserProfile> {
  //   const {
  //     userData,
  //     studySessions,
  //     progressReports,
  //     studyPlans,
  //     detailedSchedules,
  //     weeklyAssessments,
  //     uploadedMaterials,
  //     userSettings,
  //     subjectProgress,
  //     quizAttempts,
  //     topicMastery,
  //     learningAnalytics,
  //     mistakeTracking,
  //     studyMilestones
  //   } = data;


  private static async calculateComprehensiveMetrics(data: {
    userData: any;
    studySessions: StudySession[];
    progressReports: any[];
    studyPlans: any[];
    detailedSchedules: DetailedSchedule[];
    weeklyAssessments: any[];
    uploadedMaterials: any[];
    userSettings: any;
    subjectProgress: any[];
    quizAttempts: QuizAttempt[]; // NEW
    topicMastery: any[];
    learningAnalytics: any[];
    mistakeTracking: any[];
    studyMilestones: any[];
    theoryStudyLogs: TheoryStudyLog[]; // NEW
  }): Promise<ComprehensiveUserProfile> {
    const {
      userData,
      studySessions,
      progressReports,
      studyPlans,
      detailedSchedules,
      weeklyAssessments,
      uploadedMaterials,
      userSettings,
      subjectProgress,
      quizAttempts,
      topicMastery,
      learningAnalytics,
      mistakeTracking,
      studyMilestones,
      theoryStudyLogs,
    } = data;

    // Calculate study duration
    const firstSession = studySessions[studySessions.length - 1];
    const studyDuration = firstSession 
      ? Math.ceil((new Date().getTime() - new Date(firstSession.created_at).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Calculate total study hours and sessions
    const totalStudyHours = studySessions.reduce((sum: number, session: any) => sum + session.duration_minutes, 0) / 60;
    const averageSessionDuration = studySessions.length > 0 
      ? studySessions.reduce((sum: number, session: any) => sum + session.duration_minutes, 0) / studySessions.length
      : 0;

    // Calculate study consistency and streaks
    const { consistency, currentStreak, longestStreak } = this.calculateStudyConsistency(studySessions);

    // Analyze subject performance
    const subjectPerformance = this.analyzeSubjectPerformance(
      studySessions, 
      progressReports, 
      topicMastery, 
      quizAttempts
    );

    // Analyze study patterns
    const studyPatterns = this.analyzeStudyPatterns(studySessions, learningAnalytics, totalStudyHours, studyDuration);

    // Analyze assessment performance
    const assessmentData = this.analyzeAssessmentPerformance(quizAttempts, weeklyAssessments);

    // Calculate learning metrics
    const learningMetrics = this.calculateLearningMetrics(
      studySessions, 
      topicMastery, 
      quizAttempts, 
      mistakeTracking,
      theoryStudyLogs 
    );

    // Analyze schedule adherence
    const scheduleAdherence = this.analyzeScheduleAdherence(
      detailedSchedules, 
      studySessions, 
      studyMilestones
    );

    // Analyze uploaded materials
    const materialsAnalysis = this.analyzeUploadedMaterials(uploadedMaterials, studySessions);

    // Analyze mistake patterns
    const mistakeAnalysis = this.analyzeMistakePatterns(mistakeTracking, quizAttempts);

    // Analyze goal tracking
    const goalTracking = this.analyzeGoalTracking(studyMilestones, weeklyAssessments, progressReports);

    return {
      userId: userData.id,
      targetExam: userData.target_exam || 'Not specified',
      studyDuration,
      totalStudySessions: studySessions.length,
      totalStudyHours: Math.round(totalStudyHours * 100) / 100,
      averageSessionDuration: Math.round(averageSessionDuration),
      studyConsistency: consistency,
      currentStreak,
      longestStreak,
      subjectPerformance,
      studyPatterns,
      assessmentData,
      learningMetrics,
      scheduleAdherence,
      materialsAnalysis,
      mistakeAnalysis,
      goalTracking
    };
  }

  private static calculateStudyConsistency(studySessions: any[]) {
    if (studySessions.length === 0) {
      return { consistency: 0, currentStreak: 0, longestStreak: 0 };
    }

    // Get unique study dates
    const studyDates = [...new Set(studySessions.map(session => 
      session.created_at.split('T')[0]
    ))].sort();

    // Calculate consistency over last 30 days
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const studiedDays = last30Days.filter(date => studyDates.includes(date)).length;
    const consistency = Math.round((studiedDays / 30) * 100);

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (studyDates.includes(dateStr)) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (let i = 1; i < studyDates.length; i++) {
      const prevDate = new Date(studyDates[i - 1]);
      const currDate = new Date(studyDates[i]);
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { consistency, currentStreak, longestStreak };
  }

  private static analyzeSubjectPerformance(
    studySessions: any[], 
    progressReports: any[], 
    topicMastery: any[], 
    quizAttempts: any[]
  ) {
    const subjects = [...new Set(studySessions.map(session => session.subject))];
    
    return subjects.map(subject => {
      const subjectSessions = studySessions.filter(s => s.subject === subject);
      const subjectProgress = progressReports.find(p => p.subject === subject);
      const subjectTopics = topicMastery.filter(t => t.subject === subject);
      const subjectQuizAttempts = quizAttempts.filter(q => q.subject === subject); // NEW

      // Calculate metrics
      const totalHours = subjectSessions.reduce((sum, s) => sum + s.duration_minutes, 0) / 60;
      const averageScore = subjectSessions.length > 0 
        ? subjectSessions.reduce((sum, s) => sum + s.performance_score, 0) / subjectSessions.length
        : 0;

      // Get all topics studied
      const topicsStudied = [...new Set(subjectSessions.flatMap(s => s.topics_covered || []))];
      const topicsMastered = subjectTopics.filter(t => t.mastery_status === 'mastered').map(t => t.topic);

      // Aggregate weak/strong areas from quiz attempts
      const weakAreasFromQuizzes = [...new Set(subjectQuizAttempts.flatMap(qa => qa.weak_concepts || []))];
      const strongAreasFromQuizzes = [...new Set(subjectQuizAttempts.flatMap(qa => qa.strong_concepts || []))];

      // Combine with progress report data
      const weakAreas = [...new Set([...(subjectProgress?.weak_areas || []), ...weakAreasFromQuizzes])];
      const strongAreas = [...new Set([...(subjectProgress?.strong_areas || []), ...strongAreasFromQuizzes])];
      

      // // Calculate improvement trend
      // const recentSessions = subjectSessions.slice(0, 5);
      // const olderSessions = subjectSessions.slice(5, 10);
      // const recentAvg = recentSessions.length > 0 
      //   ? recentSessions.reduce((sum, s) => sum + s.performance_score, 0) / recentSessions.length
      //   : 0;
      // const olderAvg = olderSessions.length > 0 
      //   ? olderSessions.reduce((sum, s) => sum + s.performance_score, 0) / olderSessions.length
      //   : 0;

      // let improvementTrend: 'improving' | 'stable' | 'declining' = 'stable';
      // if (recentAvg > olderAvg + 0.5) improvementTrend = 'improving';
      // else if (recentAvg < olderAvg - 0.5) improvementTrend = 'declining';


      // Calculate improvement trend (using quiz attempts if available, otherwise study sessions)
      let improvementTrend: 'improving' | 'stable' | 'declining' = 'stable';
      if (subjectQuizAttempts.length >= 2) {
        const sortedQuizzes = [...subjectQuizAttempts].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        const recentAvg = sortedQuizzes.slice(-Math.min(5, sortedQuizzes.length)).reduce((sum, q) => sum + q.score_percentage, 0) / Math.min(5, sortedQuizzes.length);
        const olderAvg = sortedQuizzes.slice(0, Math.min(5, sortedQuizzes.length)).reduce((sum, q) => sum + q.score_percentage, 0) / Math.min(5, sortedQuizzes.length);

        if (recentAvg > olderAvg + 5) improvementTrend = 'improving'; // 5% threshold
        else if (recentAvg < olderAvg - 5) improvementTrend = 'declining';
      } else if (subjectSessions.length >= 2) {
        const recentSessions = subjectSessions.slice(0, 5);
        const olderSessions = subjectSessions.slice(5, 10);
        const recentAvg = recentSessions.length > 0
          ? recentSessions.reduce((sum, s) => sum + s.performance_score, 0) / recentSessions.length
          : 0;
        const olderAvg = olderSessions.length > 0
          ? olderSessions.reduce((sum, s) => sum + s.performance_score, 0) / olderSessions.length
          : 0;

        if (recentAvg > olderAvg + 0.5) improvementTrend = 'improving';
        else if (recentAvg < olderAvg - 0.5) improvementTrend = 'declining';
      }

      return {
        subject,
        totalHours: Math.round(totalHours * 100) / 100,
        sessionsCount: subjectSessions.length,
        averageScore: Math.round(averageScore * 100) / 100,
        completionPercentage: subjectProgress?.completion_percentage || 0,
        topicsStudied,
        topicsMastered,
        // weakAreas: subjectProgress?.weak_areas || [],
        // strongAreas: subjectProgress?.strong_areas || [],
        weakAreas, // Updated
        strongAreas, // Updated
        lastStudied: subjectSessions[0]?.created_at || '',
        improvementTrend
      };
    });
  }

  private static analyzeStudyPatterns(
    studySessions: any[], 
    learningAnalytics: any[],
    totalStudyHours: number,
    studyDuration: number
  ) {
    // Analyze time slots
    const timeSlotCounts: Record<string, number> = {};
    const dayOfWeekCounts: Record<string, number> = {};

    studySessions.forEach(session => {
      const date = new Date(session.created_at);
      const hour = date.getHours();
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

      // Categorize time slots
      let timeSlot = '';
      if (hour >= 5 && hour < 9) timeSlot = 'Early Morning (5-9 AM)';
      else if (hour >= 9 && hour < 12) timeSlot = 'Morning (9-12 PM)';
      else if (hour >= 12 && hour < 17) timeSlot = 'Afternoon (12-5 PM)';
      else if (hour >= 17 && hour < 21) timeSlot = 'Evening (5-9 PM)';
      else timeSlot = 'Night (9 PM-5 AM)';

      timeSlotCounts[timeSlot] = (timeSlotCounts[timeSlot] || 0) + 1;
      dayOfWeekCounts[dayOfWeek] = (dayOfWeekCounts[dayOfWeek] || 0) + session.duration_minutes;
    });

    // Find preferred time slots
    const preferredTimeSlots = Object.entries(timeSlotCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([slot]) => slot);

    // Calculate peak performance time
    const performanceByTime: Record<string, { total: number; count: number }> = {};
    studySessions.forEach(session => {
      const hour = new Date(session.created_at).getHours();
      let timeSlot = '';
      if (hour >= 5 && hour < 9) timeSlot = 'Early Morning';
      else if (hour >= 9 && hour < 12) timeSlot = 'Morning';
      else if (hour >= 12 && hour < 17) timeSlot = 'Afternoon';
      else if (hour >= 17 && hour < 21) timeSlot = 'Evening';
      else timeSlot = 'Night';

      if (!performanceByTime[timeSlot]) {
        performanceByTime[timeSlot] = { total: 0, count: 0 };
      }
      performanceByTime[timeSlot].total += session.performance_score;
      performanceByTime[timeSlot].count += 1;
    });

    const peakPerformanceTime = Object.entries(performanceByTime)
      .map(([time, data]) => ({ time, avg: data.total / data.count }))
      .sort((a, b) => b.avg - a.avg)[0]?.time || 'Morning';

    // Calculate consistency by day of week
    const consistencyByDayOfWeek: Record<string, number> = {};
    Object.entries(dayOfWeekCounts).forEach(([day, minutes]) => {
      consistencyByDayOfWeek[day] = Math.round(minutes / 60 * 100) / 100;
    });

    // Calculate monthly trends
    const monthlyData: Record<string, { hours: number; scores: number[]; topics: Set<string> }> = {};
    studySessions.forEach(session => {
      const month = new Date(session.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      if (!monthlyData[month]) {
        monthlyData[month] = { hours: 0, scores: [], topics: new Set() };
      }
      monthlyData[month].hours += session.duration_minutes / 60;
      monthlyData[month].scores.push(session.performance_score);
      session.topics_covered?.forEach((topic: string) => monthlyData[month].topics.add(topic));
    });

    const monthlyTrends = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      hoursStudied: Math.round(data.hours * 100) / 100,
      averageScore: Math.round((data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length) * 100) / 100,
      topicsCompleted: data.topics.size
    }));

    return {
      preferredTimeSlots,
      averageDailyHours: Math.round((totalStudyHours / Math.max(studyDuration, 1)) * 100) / 100,
      peakPerformanceTime,
      consistencyByDayOfWeek,
      monthlyTrends
    };
  }

  private static analyzeAssessmentPerformance(quizAttempts: any[], weeklyAssessments: any[]) {
    const allAssessments = [...quizAttempts, ...weeklyAssessments];
    
    if (allAssessments.length === 0) {
      return {
        totalQuizzes: 0,
        averageQuizScore: 0,
        bestScore: 0,
        worstScore: 0,
        improvementRate: 0,
        difficultyPreference: 'medium',
        timeManagement: 'needs_improvement' as const,
        accuracyTrend: 'stable' as const,
        quizAttempts: [], // NEW
      };
    }

    const scores = allAssessments.map(a => a.score_percentage || a.score || 0);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);

    // Calculate improvement rate
    const recentScores = scores.slice(0, 5);
    const olderScores = scores.slice(5, 10);
    const recentAvg = recentScores.length > 0 ? recentScores.reduce((sum, s) => sum + s, 0) / recentScores.length : 0;
    const olderAvg = olderScores.length > 0 ? olderScores.reduce((sum, s) => sum + s, 0) / olderScores.length : 0;
    const improvementRate = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

    // Analyze time management
    const avgTimePerQuestion = quizAttempts.length > 0
      ? quizAttempts.reduce((sum, quiz) => sum + (quiz.time_taken_minutes / quiz.total_questions), 0) / quizAttempts.length
      : 0;
    
    let timeManagement: 'excellent' | 'good' | 'needs_improvement' = 'needs_improvement';
    if (avgTimePerQuestion <= 1.5) timeManagement = 'excellent';
    else if (avgTimePerQuestion <= 2.5) timeManagement = 'good';

    // Determine accuracy trend
    let accuracyTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (improvementRate > 5) accuracyTrend = 'improving';
    else if (improvementRate < -5) accuracyTrend = 'declining';

    return {
      totalQuizzes: allAssessments.length,
      averageQuizScore: Math.round(averageScore * 100) / 100,
      bestScore,
      worstScore,
      improvementRate: Math.round(improvementRate * 100) / 100,
      difficultyPreference: 'medium', // Could be enhanced based on quiz difficulty data
      timeManagement,
      accuracyTrend,
      quizAttempts: quizAttempts, // NEW
    };
  }

  private static calculateLearningMetrics(
    studySessions: any[], 
    topicMastery: any[], 
    quizAttempts: QuizAttempt[], // NEW 
    mistakeTracking: any[],
    theoryStudyLogs: TheoryStudyLog[] // NEW
  ) {
    const totalStudyHours = studySessions.reduce((sum, s) => sum + s.duration_minutes, 0) / 60;
    const totalTheoryStudyHours = theoryStudyLogs.reduce((sum, log) => sum + log.duration_minutes, 0) / 60;
    const masteredTopics = topicMastery.filter(t => t.mastery_status === 'mastered').length;
    
    const conceptsLearnedPerHour = (totalStudyHours + totalTheoryStudyHours) > 0 ? masteredTopics / (totalStudyHours + totalTheoryStudyHours) : 0; // Updated

    // Calculate retention rate based on quiz performance over time
    const retentionRate = this.calculateRetentionRate(quizAttempts);

    // Calculate revision efficiency
    const revisionSessions = studySessions.filter(s => 
      s.topics_covered?.some((topic: string) => 
        topicMastery.some(tm => tm.topic === topic && tm.mastery_status === 'mastered')
      )
    );
    const revisionEfficiency = revisionSessions.length > 0 
      ? revisionSessions.reduce((sum, s) => sum + s.performance_score, 0) / revisionSessions.length / 10 * 100
      : 0;

    // Calculate weakness improvement rate
    const resolvedMistakes = mistakeTracking.filter(m => m.resolved_at).length;
    const totalMistakes = mistakeTracking.length;
    const weaknessImprovementRate = totalMistakes > 0 ? (resolvedMistakes / totalMistakes) * 100 : 0;

    // Calculate strength maintenance rate
    const strongSubjects = topicMastery.filter(t => t.mastery_status === 'mastered');
    const maintainedStrengths = strongSubjects.filter(t => {
      const lastPracticed = new Date(t.last_practiced_at || 0);
      const daysSinceLastPractice = (new Date().getTime() - lastPracticed.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceLastPractice <= 7; // Practiced within last week
    }).length;
    const strengthMaintenanceRate = strongSubjects.length > 0 ? (maintainedStrengths / strongSubjects.length) * 100 : 0;

    return {
      conceptsLearnedPerHour: Math.round(conceptsLearnedPerHour * 100) / 100,
      retentionRate: Math.round(retentionRate * 100) / 100,
      revisionEfficiency: Math.round(revisionEfficiency * 100) / 100,
      weaknessImprovementRate: Math.round(weaknessImprovementRate * 100) / 100,
      strengthMaintenanceRate: Math.round(strengthMaintenanceRate * 100) / 100,
      theoryStudyHours: Math.round(totalTheoryStudyHours * 100) / 100, // NEW
    };
  }

  private static calculateRetentionRate(quizAttempts: any[]): number {
    if (quizAttempts.length < 2) return 0;

    // Group quizzes by topic and calculate retention
    const topicQuizzes: Record<string, QuizAttempt[]> = {};
    quizAttempts.forEach(quiz => {
      if (!topicQuizzes[quiz.topic || 'general']) { // Use 'general' if topic is undefined
        topicQuizzes[quiz.topic || 'general'] = [];
      }
      topicQuizzes[quiz.topic || 'general'].push(quiz);
    });

    let totalRetention = 0;
    let topicsWithMultipleAttempts = 0;

    Object.values(topicQuizzes).forEach(quizzes => {
      if (quizzes.length >= 2) {
        quizzes.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        const firstScore = quizzes[0].score_percentage;
        const lastScore = quizzes[quizzes.length - 1].score_percentage;
        
        // Retention is maintained if score doesn't drop significantly
        const retention = Math.max(0, Math.min(100, lastScore / firstScore * 100));
        totalRetention += retention;
        topicsWithMultipleAttempts++;
      }
    });

    return topicsWithMultipleAttempts > 0 ? totalRetention / topicsWithMultipleAttempts : 0;
  }

  private static analyzeScheduleAdherence(
    detailedSchedules: DetailedSchedule[], // Use DetailedSchedule type
    studySessions: StudySession[], // Use StudySession type
    studyMilestones: any[]
  ) {
    if (detailedSchedules.length === 0) {
      return {
        plannedVsActualHours: 0,
        missedSessions: 0,
        completedMilestones: 0,
        totalMilestones: 0,
        scheduleEffectiveness: 0,
        missedScheduledSessions: [],
      };
    }

    const latestSchedule = detailedSchedules[0];
    const plannedDailyHours = latestSchedule.student_profile?.dailyAvailableHours || 0;
    
    // Calculate actual vs planned hours
    const actualDailyHours = studySessions.length > 0
      ? studySessions.reduce((sum, s) => sum + s.duration_minutes, 0) / 60 / studySessions.length
      : 0;
    
    const plannedVsActualHours = plannedDailyHours > 0 ? (actualDailyHours / plannedDailyHours) * 100 : 0;

    // Calculate milestone completion
    const completedMilestones = studyMilestones.filter(m => m.is_achieved).length;
    const totalMilestones = studyMilestones.length;

    // NEW: Calculate missed scheduled sessions
    const missedScheduledSessions: { date: string; dayOfWeek: string; subject: string; topics: string[] }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    

    if (latestSchedule.daily_schedule && Array.isArray(latestSchedule.daily_schedule)) {
      for (const daySchedule of latestSchedule.daily_schedule) {
        const scheduleDate = new Date(daySchedule.date);
        scheduleDate.setHours(0, 0, 0, 0);
    
    // Only consider past scheduled days up to today
        if (scheduleDate < today) {
          if (daySchedule.subjects && Array.isArray(daySchedule.subjects)) {
            for (const scheduledSubject of daySchedule.subjects) {
              const hasStudied = studySessions.some(session => {
                const sessionDate = new Date(session.created_at);
                sessionDate.setHours(0, 0, 0, 0);
                return sessionDate.getTime() === scheduleDate.getTime() &&
                       session.subject === scheduledSubject.subject;
              });

              if (!hasStudied) {
                missedScheduledSessions.push({
                  date: daySchedule.date,
                  dayOfWeek: daySchedule.dayOfWeek,
                  subject: scheduledSubject.subject,
                  topics: scheduledSubject.topics || [],
                });
              }
            }
          }
        }
      }
    }

    const missedSessionsCount = missedScheduledSessions.length; // Total count of missed sessions

    const scheduleEffectiveness = (plannedVsActualHours + (completedMilestones / Math.max(totalMilestones, 1)) * 100) / 2;

    return {
      plannedVsActualHours: Math.round(plannedVsActualHours),
      missedSessions: missedSessionsCount, // Updated to reflect actual missed count
      completedMilestones,
      totalMilestones,
      scheduleEffectiveness: Math.round(scheduleEffectiveness),
      missedScheduledSessions, // NEW
    };
  }

  private static analyzeUploadedMaterials(uploadedMaterials: any[], studySessions: any[]) {
    const totalMaterials = uploadedMaterials.length;
    const averageRelevanceScore = totalMaterials > 0
      ? uploadedMaterials.reduce((sum, m) => sum + m.exam_relevance_score, 0) / totalMaterials
      : 0;

    const topicsExtracted = [...new Set(uploadedMaterials.flatMap(m => m.processed_topics || []))];
    const contentTypes = [...new Set(uploadedMaterials.map(m => m.filename.split('.').pop()))];

    // Calculate utilization rate (how much uploaded content is actually studied)
    const uploadedTopics = new Set(topicsExtracted);
    const studiedTopics = new Set(studySessions.flatMap(s => s.topics_covered || []));
    const utilizedTopics = [...uploadedTopics].filter(topic => 
      [...studiedTopics].some(studied => 
        studied.toLowerCase().includes(topic.toLowerCase()) || 
        topic.toLowerCase().includes(studied.toLowerCase())
      )
    );
    const utilizationRate = uploadedTopics.size > 0 ? (utilizedTopics.length / uploadedTopics.size) * 100 : 0;

    return {
      totalMaterialsUploaded: totalMaterials,
      averageRelevanceScore: Math.round(averageRelevanceScore * 100) / 100,
      topicsExtracted,
      contentTypes,
      utilizationRate: Math.round(utilizationRate)
    };
  }

  private static analyzeMistakePatterns(mistakeTracking: any[], quizAttempts: any[]) {
    const commonMistakeTypes = this.getTopMistakeTypes(mistakeTracking);
    const repeatedMistakes = mistakeTracking.filter(m => m.is_repeated_mistake).length;
    const conceptualGaps = [...new Set(mistakeTracking
      .filter(m => m.mistake_type === 'conceptual')
      .map(m => m.concept_involved))];
    
    const resolvedMistakes = mistakeTracking.filter(m => m.resolved_at).length;
    const mistakeResolutionRate = mistakeTracking.length > 0 ? (resolvedMistakes / mistakeTracking.length) * 100 : 0;

    // Identify improvement areas based on mistake patterns
    const improvementAreas = this.identifyImprovementAreas(mistakeTracking, quizAttempts);

    return {
      commonMistakeTypes,
      repeatedMistakes,
      conceptualGaps,
      improvementAreas,
      mistakeResolutionRate: Math.round(mistakeResolutionRate)
    };
  }

  private static getTopMistakeTypes(mistakeTracking: any[]): string[] {
    const typeCounts: Record<string, number> = {};
    mistakeTracking.forEach(mistake => {
      typeCounts[mistake.mistake_type] = (typeCounts[mistake.mistake_type] || 0) + 1;
    });

    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);
  }

  private static identifyImprovementAreas(mistakeTracking: any[], quizAttempts: any[]): string[] {
    const areas = new Set<string>();

    // From mistake tracking
    mistakeTracking.forEach(mistake => {
      if (!mistake.resolved_at) {
        areas.add(`${mistake.subject} - ${mistake.concept_involved}`);
      }
    });

    // From quiz performance
    quizAttempts.forEach(quiz => {
      if (quiz.score_percentage < 70) {
        quiz.weak_concepts?.forEach((concept: string) => areas.add(`${quiz.subject} - ${concept}`));
      }
    });

    return Array.from(areas).slice(0, 5);
  }

  private static analyzeGoalTracking(studyMilestones: any[], weeklyAssessments: any[], progressReports: any[]) {
    const weeklyGoalsSet = studyMilestones.filter(m => m.milestone_type === 'weekly_goal').length;
    const weeklyGoalsAchieved = studyMilestones.filter(m => 
      m.milestone_type === 'weekly_goal' && m.is_achieved
    ).length;

    // Calculate exam readiness based on overall progress
    const overallProgress = progressReports.length > 0
      ? progressReports.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / progressReports.length
      : 0;

    // Calculate confidence level based on recent performance
    const recentAssessments = weeklyAssessments.slice(0, 5);
    const confidenceLevel = recentAssessments.length > 0
      ? recentAssessments.reduce((sum, a) => sum + a.score, 0) / recentAssessments.length
      : 0;

    return {
      weeklyGoalsSet,
      weeklyGoalsAchieved,
      monthlyTargets: [], // Could be enhanced with monthly milestone tracking
      examReadiness: Math.round(overallProgress),
      confidenceLevel: Math.round(confidenceLevel)
    };
  }
}