import { useState, useEffect } from 'react';
import { supabase, DetailedSchedule } from '../lib/supabase';

export const useDetailedSchedule = (userId: string | undefined) => {
  const [detailedSchedule, setDetailedSchedule] = useState<DetailedSchedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchDetailedSchedule();
    }
  }, [userId]);

  const fetchDetailedSchedule = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('detailed_schedules')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching detailed schedule:', error);
      }
      
      setDetailedSchedule(data && data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error('Error fetching detailed schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDetailedSchedule = async (
    examType: string,
    studentProfile: any,
    dailySchedule: any[],
    totalDays: number,
    totalWeeks: number,
    studyPlanId?: string
  ) => {
    if (!userId) throw new Error('User not authenticated');

    try {
      setLoading(true);

      const newSchedule: Omit<DetailedSchedule, 'id' | 'created_at' | 'updated_at'> = {
        user_id: userId,
        study_plan_id: studyPlanId,
        exam_type: examType,
        student_profile: studentProfile,
        daily_schedule: dailySchedule,
        total_days: totalDays,
        total_weeks: totalWeeks,
        generation_parameters: {
          dailyHours: studentProfile.dailyAvailableHours,
          subjects: studentProfile.subjects,
          weakSubjects: studentProfile.weakSubjects,
          studyPattern: studentProfile.studyPattern,
          targetDate: studentProfile.examDate,
        },
      };

      const { data, error } = await supabase
        .from('detailed_schedules')
        .insert([newSchedule])
        .select()
        .single();

      if (error) {
        console.error('Error saving detailed schedule:', error);
        throw error;
      }

      setDetailedSchedule(data);
      return data;
    } catch (error) {
      console.error('Error saving detailed schedule:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteDetailedSchedule = async (scheduleId: string) => {
    try {
      const { error } = await supabase
        .from('detailed_schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) {
        console.error('Error deleting detailed schedule:', error);
        throw error;
      }

      setDetailedSchedule(null);
    } catch (error) {
      console.error('Error deleting detailed schedule:', error);
      throw error;
    }
  };

  return {
    detailedSchedule,
    loading,
    saveDetailedSchedule,
    deleteDetailedSchedule,
    refreshDetailedSchedule: fetchDetailedSchedule,
  };
};