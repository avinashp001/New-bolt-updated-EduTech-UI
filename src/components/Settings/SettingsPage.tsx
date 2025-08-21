import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Brain, 
  Eye, 
  Download, 
  Trash2, 
  Moon, 
  Sun,
  Monitor,
  Volume2,
  VolumeX,
  Smartphone,
  Globe,
  Database,
  Zap,
  Save,
  RotateCcw
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../hooks/useSettings';
import { useAuth } from '../../hooks/useAuth';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const { settings, loading, saving, updateSettings, resetSettings, exportSettings } = useSettings();
  const { user, updateProfile, clearAllUserData } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    target_exam: user?.target_exam || '',
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'ai', label: 'AI Settings', icon: Brain },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'privacy', label: 'Privacy & Data', icon: Shield },
    { id: 'advanced', label: 'Advanced', icon: Zap },
  ];

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileData);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion feature will be implemented soon.');
    }
  };

  const handleClearAllData = async () => {
    const confirmMessage = `⚠️ WARNING: This will permanently delete ALL your data including:

• All study sessions and progress
• Study plans and schedules  
• Weekly assessments and scores
• Uploaded materials and analysis
• Settings and preferences
• Progress reports and analytics

This action CANNOT be undone. You will start completely fresh.

Are you absolutely sure you want to clear all your data?`;

    if (window.confirm(confirmMessage)) {
      const doubleConfirm = window.confirm('Last chance! This will delete EVERYTHING. Are you 100% sure?');
      
      if (doubleConfirm) {
        try {
          await clearAllUserData();
          alert('✅ All your data has been successfully cleared! You can now start your learning journey fresh.');
          // Optionally reload the page to reset all components
          window.location.reload();
        } catch (error) {
          console.error('Error clearing user data:', error);
          alert('❌ Error clearing data. Please try again or contact support.');
        }
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Target Exam
                  </label>
                  <select
                    value={profileData.target_exam}
                    onChange={(e) => setProfileData(prev => ({ ...prev, target_exam: e.target.value }))}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="">Select your target exam</option>
                    <option value="UPSC Civil Services">UPSC Civil Services</option>
                    <option value="SSC CGL">SSC CGL</option>
                    <option value="Banking (SBI PO/Clerk)">Banking (SBI PO/Clerk)</option>
                    <option value="JEE Main/Advanced">JEE Main/Advanced</option>
                    <option value="NEET">NEET</option>
                    <option value="CAT">CAT</option>
                    <option value="GATE">GATE</option>
                    <option value="Board Exams (Class 12)">Board Exams (Class 12)</option>
                  </select>
                </div>
                <button
                  onClick={handleProfileUpdate}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Profile</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Study Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Default Study Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={settings.defaultStudyDuration}
                    onChange={(e) => updateSettings({ defaultStudyDuration: parseInt(e.target.value) })}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Break Interval (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={settings.breakInterval}
                    onChange={(e) => updateSettings({ breakInterval: parseInt(e.target.value) })}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-100">Break Reminders</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Get notified when it's time for a break</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ breakReminders: !settings.breakReminders })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.breakReminders ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.breakReminders ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Theme</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'light'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
                  }`}
                >
                  <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <p className="font-medium text-slate-800 dark:text-slate-100">Light</p>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
                  }`}
                >
                  <Moon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="font-medium text-slate-800 dark:text-slate-100">Dark</p>
                </button>
                <button
                  onClick={() => {
                    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    setTheme(systemTheme);
                  }}
                  className="p-4 rounded-lg border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 transition-all"
                >
                  <Monitor className="w-8 h-8 mx-auto mb-2 text-slate-600 dark:text-slate-400" />
                  <p className="font-medium text-slate-800 dark:text-slate-100">System</p>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Display</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Font Size
                  </label>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => updateSettings({ fontSize: e.target.value as 'small' | 'medium' | 'large' })}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">AI Mentor Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    AI Mentor Persona
                  </label>
                  <select
                    value={settings.aiMentorPersona}
                    onChange={(e) => updateSettings({ aiMentorPersona: e.target.value as any })}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="encouraging">Encouraging & Supportive</option>
                    <option value="formal">Professional & Formal</option>
                    <option value="direct">Direct & Concise</option>
                    <option value="humorous">Friendly & Humorous</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Response Detail Level
                  </label>
                  <select
                    value={settings.aiResponseVerbosity}
                    onChange={(e) => updateSettings({ aiResponseVerbosity: e.target.value as any })}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="concise">Concise & Brief</option>
                    <option value="standard">Standard Detail</option>
                    <option value="verbose">Detailed & Comprehensive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Study Plan Style
                  </label>
                  <select
                    value={settings.studyPlanStyle}
                    onChange={(e) => updateSettings({ studyPlanStyle: e.target.value as any })}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="visual">Visual Learner</option>
                    <option value="auditory">Auditory Learner</option>
                    <option value="kinesthetic">Kinesthetic Learner</option>
                    <option value="mixed">Mixed Learning Style</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'studyReminders', label: 'Study Reminders', desc: 'Get reminded about scheduled study sessions' },
                  { key: 'progressUpdates', label: 'Progress Updates', desc: 'Receive updates about your learning progress' },
                  { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Get weekly summary of your study activities' },
                  { key: 'achievementNotifications', label: 'Achievement Notifications', desc: 'Celebrate your milestones and achievements' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-100">{item.label}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => updateSettings({ [item.key]: !settings[item.key as keyof typeof settings] })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Accessibility Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-100">High Contrast Mode</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Increase contrast for better visibility</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.highContrast ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-100">Reduced Motion</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Minimize animations and transitions</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.reducedMotion ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Privacy & Data</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-100">Data Sharing</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Share anonymized data to improve AI features</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ dataSharing: !settings.dataSharing })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.dataSharing ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.dataSharing ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-100">Analytics</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Help improve the app with usage analytics</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ analyticsOptIn: !settings.analyticsOptIn })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.analyticsOptIn ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.analyticsOptIn ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Data Management</h3>
              <div className="space-y-3">
                <button
                  onClick={exportSettings}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export My Data</span>
                </button>
                <button
                  onClick={handleClearAllData}
                  className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Database className="w-4 h-4" />
                  <span>Clear All My Data</span>
                </button>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 text-sm">
                    <strong>Warning:</strong> Clearing all data will permanently delete your study sessions, 
                    progress reports, uploaded materials, and all other learning data. This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Advanced Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Auto-save Interval (seconds)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={settings.autoSaveInterval}
                    onChange={(e) => updateSettings({ autoSaveInterval: parseInt(e.target.value) })}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-100">Focus Mode</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Hide distracting elements during study</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ focusMode: !settings.focusMode })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.focusMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.focusMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-100">Experimental Features</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Enable beta features and improvements</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ experimentalFeatures: !settings.experimentalFeatures })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.experimentalFeatures ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.experimentalFeatures ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Reset Settings</h3>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all settings to default?')) {
                    resetSettings();
                  }
                }}
                className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Defaults</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-2xl text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Settings className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Settings</h2>
        </div>
        <p className="text-purple-100">
          Customize your learning experience with advanced preferences and controls
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            {renderTabContent()}
            
            {saving && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-sm">Saving settings...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;