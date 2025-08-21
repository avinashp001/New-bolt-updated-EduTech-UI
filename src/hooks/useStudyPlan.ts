import { useState, useEffect } from 'react';
import { supabase, StudyPlan } from '../lib/supabase';
import { AIService } from '../lib/mistralAI';
import { robustParseWithRetry } from '../utils/jsonParser';

export const useStudyPlan = (userId: string | undefined) => {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);

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
          await clearAllUserData();
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

      // Use AI to generate study plan
      const aiPlanResponse = await AIService.generateStudyPlan(
        examType,
        subjects,
        dailyHours,
        targetDate,
        studentProfile
      );

      // Try robust parsing with retry
let aiPlan = await robustParseWithRetry(() =>
  AIService.generateStudyPlan(
    examType,
    subjects,
    dailyHours,
    targetDate,
    studentProfile
  )
);

if (!aiPlan) {
  console.error('❌ Could not parse AI plan. Showing minimal fallback plan.');

  aiPlan = {
    milestones: [
      ...subjects.map((subject, index) => ({
        title: `Week ${Math.ceil((index + 1) * diffWeeks / subjects.length)}: ${subject} Mastery`,
        description: `Complete comprehensive study and assessment of ${subject} topics`,
        week: Math.ceil((index + 1) * diffWeeks / subjects.length),
        subject: subject
      })),
      ...(studentProfile?.detailedSchedule ? [{
        title: 'Detailed Daily Schedule',
        description: 'AI-generated daily study schedule',
        dailySchedule: studentProfile.detailedSchedule
      }] : [])
    ]
  };
}
      
      // If studentProfile contains detailedSchedule, add it to milestones
      if (studentProfile?.detailedSchedule && !aiPlan.milestones.some((m: any) => m.dailySchedule)) {
        aiPlan.milestones.push({
          title: 'Detailed Daily Schedule',
          description: 'AI-generated daily study schedule',
          dailySchedule: studentProfile.detailedSchedule
        });
      }

      const newStudyPlan: Omit<StudyPlan, 'id' | 'created_at' | 'updated_at'> = {
        user_id: userId,
        exam_type: examType,
        total_duration_weeks: diffWeeks,
        subjects,
        daily_hours: dailyHours,
        milestones: aiPlan.milestones || [],
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