import React from 'react';
import { Flame, TrendingUp, Calendar, Target } from 'lucide-react';

interface StreakTrackerProps {
  currentStreak: number;
  studySessions: any[];
}

const StreakTracker: React.FC<StreakTrackerProps> = ({ currentStreak, studySessions }) => {
  // Calculate weekly progress (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const weeklyData = last7Days.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    const daySessions = studySessions.filter(session => 
      session.created_at.split('T')[0] === dateStr
    );
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      hasStudy: daySessions.length > 0,
      sessions: daySessions.length
    };
  });

  const studiedDaysThisWeek = weeklyData.filter(day => day.hasStudy).length;
  const weeklyProgress = (studiedDaysThisWeek / 7) * 100;

  // Calculate streak statistics
  const longestStreak = Math.max(currentStreak, calculateLongestStreak());
  const streakPercentage = Math.min((currentStreak / 30) * 100, 100); // 30 days as max

  function calculateLongestStreak(): number {
    if (studySessions.length === 0) return 0;
    
    const sessionDates = [...new Set(studySessions.map(session => 
      session.created_at.split('T')[0]
    ))].sort();
    
    let maxStreak = 0;
    let currentStreakCount = 1;
    
    for (let i = 1; i < sessionDates.length; i++) {
      const prevDate = new Date(sessionDates[i - 1]);
      const currDate = new Date(sessionDates[i]);
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreakCount++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreakCount);
        currentStreakCount = 1;
      }
    }
    
    return Math.max(maxStreak, currentStreakCount);
  }

  return (
    <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold dark:text-white/80 text-slate-800 mb-2">Streak Counter</h3>
        <p className="text-slate-600 dark:text-white/80 text-sm">Your current week streak: {studiedDaysThisWeek}</p>
        <p className="text-slate-500 dark:text-white/70 text-xs">Streak star shine far!</p>
      </div>

      {/* Main Streak Display */}
      <div className="relative flex items-center justify-center mb-6">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="8"
          />
          
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="url(#streakGradient)"
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={`${2 * Math.PI * 50 * (1 - streakPercentage / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-3xl dark:text-white/80 font-bold text-slate-800">{currentStreak}</div>
            <div className="text-sm dark:text-white/80 text-slate-600">Days</div>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm dark:text-white/80 font-medium text-slate-700">Weekly Progress</span>
          <span className="text-sm dark:text-white/80 font-bold text-slate-800">{Math.round(weeklyProgress)}%</span>
        </div>
        
        <div className="flex items-center space-x-1 mb-3">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex-1 text-center">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                day.hasStudy 
                  ? 'bg-green-500 text-white' 
                  : 'bg-slate-100 text-slate-400 dark:text-slate-800/80'
              }`}>
                {day.day.charAt(0)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${weeklyProgress}%` }}
          />
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
          <div className="text-lg font-bold text-orange-700">{currentStreak}</div>
          <div className="text-xs text-orange-600">Current</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <div className="text-lg font-bold text-green-700">{longestStreak}</div>
          <div className="text-xs text-green-600">Best Streak</div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <div className="text-center">
          <div className="text-sm font-medium text-blue-800">
            {currentStreak >= 7 ? '🔥 You\'re on fire!' : 
             currentStreak >= 3 ? '⭐ Great momentum!' : 
             '💪 Keep building!'}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            {currentStreak >= 7 ? 'Amazing consistency!' : 
             currentStreak >= 3 ? 'You\'re building a great habit!' : 
             'Every day counts towards your goal!'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakTracker;