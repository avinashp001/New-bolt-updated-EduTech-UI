import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface UserSettings {
  // AI Preferences
  aiMentorPersona: 'encouraging' | 'formal' | 'direct' | 'humorous';
  aiResponseVerbosity: 'concise' | 'standard' | 'verbose';
  studyPlanStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  
  // Notification Preferences
  studyReminders: boolean;
  progressUpdates: boolean;
  weeklyReports: boolean;
  achievementNotifications: boolean;
  
  // Study Preferences
  defaultStudyDuration: number; // in minutes
  breakReminders: boolean;
  breakInterval: number; // in minutes
  focusMode: boolean;
  
  // Accessibility
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reducedMotion: boolean;
  
  // Privacy
  dataSharing: boolean;
  analyticsOptIn: boolean;
  
  // Advanced
  autoSaveInterval: number; // in seconds
  offlineMode: boolean;
  experimentalFeatures: boolean;
  
  // Onboarding Preferences
  currentLevel: string;
  preferredStudyTime: string;
  learningStyle: string;
  contentPreference: string;
  motivationLevel: string;
  commonDistractions: string[];
  shortTermGoal: string;
  weakSubjects: string[];
  selectedSubjects: string[];
  dailyHours: number;
  targetDate: string;
}

const defaultSettings: UserSettings = {
  aiMentorPersona: 'encouraging',
  aiResponseVerbosity: 'standard',
  studyPlanStyle: 'mixed',
  studyReminders: true,
  progressUpdates: true,
  weeklyReports: true,
  achievementNotifications: true,
  defaultStudyDuration: 60,
  breakReminders: true,
  breakInterval: 25,
  focusMode: false,
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  dataSharing: false,
  analyticsOptIn: true,
  autoSaveInterval: 30,
  offlineMode: false,
  experimentalFeatures: false,
  
  // Onboarding Preferences
  currentLevel: 'intermediate',
  preferredStudyTime: 'morning',
  learningStyle: 'mixed',
  contentPreference: 'balanced',
  motivationLevel: 'high',
  commonDistractions: [],
  shortTermGoal: '',
  weakSubjects: [],
  selectedSubjects: [],
  dailyHours: 6,
  targetDate: '',
};

export const useSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadSettings();
    }
  }, [user?.id]);

  const loadSettings = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Try to load from Supabase first
      const { data, error } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data && !error) {
        setSettings({ ...defaultSettings, ...data.settings });
      } else {
        // Fallback to localStorage
        const savedSettings = localStorage.getItem(`settings_${user.id}`);
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsed });
          } else {
           // If no settings found in DB or localStorage, use default settings
          setSettings(defaultSettings);
          }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // Use localStorage as fallback
      const savedSettings = localStorage.getItem(`settings_${user.id}`);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } else {
        setSettings(defaultSettings);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user?.id) return;

    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    // Save to localStorage immediately for responsiveness
    localStorage.setItem(`settings_${user.id}`, JSON.stringify(updatedSettings));

    try {
      setSaving(true);
      
      // Try to save to Supabase
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          settings: updatedSettings,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving settings to Supabase:', error);
        // Settings are still saved in localStorage
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      // Settings are still saved in localStorage
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = async () => {
    await updateSettings(defaultSettings);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `eduai-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return {
    settings,
    loading,
    saving,
    updateSettings,
    resetSettings,
    exportSettings,
  };
};