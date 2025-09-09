import { useState, useEffect, useCallback } from 'react';
import { supabase, UserUsage } from '../lib/supabase';
import { useAuth } from './useAuth';

// Define feature keys and their free tier limits
export const USAGE_LIMITS = {
  AI_MENTOR_CHAT: 100, // 1 Free tier limit for AI Mentor chat messages per day
  THEORY_GENERATION: 300, // 2 Free tier limit for theory generation per day
  AI_TEST_SESSION: 200, // 2 Free tier limit for AI test sessions per day
  WEEKLY_ASSESSMENT: 300, // 3 Free tier limit for weekly assessments per day
  // Add more features as needed
};

// Define feature display names for the UI
export const FEATURE_NAMES: { [key: string]: string } = {
  AI_MENTOR_CHAT: 'AI Mentor Chat',
  THEORY_GENERATION: 'Theory Generation',
  AI_TEST_SESSION: 'AI Test Session',
  WEEKLY_ASSESSMENT: 'Weekly Assessment',
};

export const useUsage = () => {
  const { user: authUser } = useAuth(); // Get user from useAuth hook
  const [usageData, setUsageData] = useState<Record<string, UserUsage>>({});
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false); // Placeholder for premium status

  // Function to fetch all usage data for the current user
  const fetchUsage = useCallback(async () => {
    if (!authUser?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    try {
      const { data, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', authUser.id);

      if (error) {
        console.error('Error fetching usage data:', error);
        return;
      }

      const newUsageData: Record<string, UserUsage> = {};
      for (const item of data) {
        // Reset daily count if last_reset_date is not today
        if (item.last_reset_date !== today) {
          const { error: updateError } = await supabase
            .from('user_usage')
            .update({ daily_count: 0, last_reset_date: today, updated_at: new Date().toISOString() })
            .eq('id', item.id);
          if (updateError) {
            console.error('Error resetting usage count:', updateError);
          }
          newUsageData[item.feature_key] = { ...item, daily_count: 0, last_reset_date: today };
        } else {
          newUsageData[item.feature_key] = item;
        }
      }
      setUsageData(newUsageData);
    } catch (error) {
      console.error('Unexpected error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  }, [authUser?.id]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  // Function to increment usage for a specific feature
  const incrementUsage = useCallback(async (featureKey: string) => {
    if (!authUser?.id || isPremium) return; // No need to track for premium users

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    try {
      const currentUsage = usageData[featureKey];

      if (currentUsage) {
        // If entry exists, update it
        const { data, error } = await supabase
          .from('user_usage')
          .update({
            daily_count: currentUsage.daily_count + 1,
            last_reset_date: today,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentUsage.id)
          .select()
          .single();

        if (error) throw error;
        setUsageData(prev => ({ ...prev, [featureKey]: data }));
      } else {
        // If no entry, create a new one
        const { data, error } = await supabase
          .from('user_usage')
          .insert({
            user_id: authUser.id,
            feature_key: featureKey,
            daily_count: 1,
            last_reset_date: today,
          })
          .select()
          .single();

        if (error) throw error;
        setUsageData(prev => ({ ...prev, [featureKey]: data }));
      }
    } catch (error) {
      console.error(`Error incrementing usage for ${featureKey}:`, error);
    }
  }, [authUser?.id, usageData, isPremium]);

  // Function to get current usage count for a feature
  const getUsage = useCallback((featureKey: string): number => {
    return usageData[featureKey]?.daily_count || 0;
  }, [usageData]);

  // Function to check if usage limit has been exceeded
  const hasExceededLimit = useCallback((featureKey: string): boolean => {
    if (isPremium) return false; // Premium users have no limits
    const currentCount = getUsage(featureKey);
    const limit = USAGE_LIMITS[featureKey as keyof typeof USAGE_LIMITS];
    return currentCount >= limit;
  }, [getUsage, isPremium]);

  // Placeholder for checking premium status (to be implemented later)
  // For now, all users are considered non-premium for tracking purposes
  useEffect(() => {
    // In a real app, you would fetch user's subscription status here
    // For example:
    // const fetchSubscriptionStatus = async () => {
    //   const { data, error } = await supabase.from('subscriptions').select('status').eq('user_id', authUser.id).single();
    //   if (data?.status === 'active_premium') {
    //     setIsPremium(true);
    //   } else {
    //     setIsPremium(false);
    //   }
    // };
    // if (authUser?.id) {
    //   fetchSubscriptionStatus();
    // }
    setIsPremium(false); // Default to false for free tier simulation
  }, [authUser?.id]);


  return {
    loading,
    isPremium,
    getUsage,
    incrementUsage,
    hasExceededLimit,
    USAGE_LIMITS, // Export limits for display in UI
    FEATURE_NAMES, // Export feature names for display in UI
    fetchUsage, // Allow components to refetch usage data
  };
};

