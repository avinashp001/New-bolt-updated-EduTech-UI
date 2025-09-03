import React, { useMemo } from 'react';
import { Flame, Zap, TrendingUp, Award } from 'lucide-react';

interface StreakTrackerProps {
  currentStreak: number;
  studySessions: { created_at: string; duration_minutes?: number }[];
}

const formatHours = (minutes: number) => {
  if (!minutes) return '0.0h';
  const hours = minutes / 60;
  return `${Math.round(hours * 100) / 100}h`;
};

export default function StreakTracker({ currentStreak = 0, studySessions = [] }: StreakTrackerProps) {
  const today = useMemo(() => new Date(), []);

  // build last 7 days (left -> right oldest -> newest)
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d;
    });
  }, [today]);

  // map studySessions into a set of date strings for quick lookup
  const sessionDates = useMemo(() => {
    return new Set(studySessions.map(s => s.created_at.split('T')[0]));
  }, [studySessions]);

  const weeklyData = last7Days.map(d => {
    const dateStr = d.toISOString().split('T')[0];
    return {
      date: dateStr,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
      fullLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
      hasStudy: sessionDates.has(dateStr),
      isToday: d.toDateString() === new Date().toDateString(),
    };
  });

  const studiedDaysThisWeek = weeklyData.filter(d => d.hasStudy).length;
  const weeklyProgressPercent = Math.round((studiedDaysThisWeek / 7) * 100);

  // calculate hours this week
  const minutesThisWeek = useMemo(() => {
    const setOfDates = new Set(last7Days.map(d => d.toISOString().split('T')[0]));
    return studySessions.reduce((sum, s) => {
      const sdate = s.created_at.split('T')[0];
      if (setOfDates.has(sdate)) return sum + (s.duration_minutes || 0);
      return sum;
    }, 0);
  }, [last7Days, studySessions]);

  const hoursThisWeek = formatHours(minutesThisWeek);

  // show percentage badge above flame (based on current streak vs 7-day goal)
  const streakPct = Math.min(Math.round((currentStreak / 7) * 100), 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 max-w-sm">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-slate-800 dark:text-white/80">Streak Counter</h4>
      </div>

      {/* Flame circle with badge */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-md">
            <Flame className="w-8 h-8 text-white" />
          </div>

          {/* small yellow/percent badge */}
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs text-slate-900 font-semibold rounded-full px-2 py-0.5 shadow-md">
            {streakPct}%
          </div>
        </div>

        {/* big streak number */}
        <div className="mt-3 text-2xl font-bold text-slate-800 dark:text-white/90">{currentStreak}</div>
        <div className="text-xs dark:text-white/80 text-slate-500 mt-1">Your current week streak: <span className="font-medium">{currentStreak}</span></div>
        <button className="text-xs text-blue-600 mt-1 underline">Streak star shine far!</button>
      </div>

      {/* Weekly Progress row */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm dark:text-white/80 font-medium text-slate-700">Weekly Progress</div>
        <div className="text-xs dark:text-white/80 font-semibold text-slate-800">{studiedDaysThisWeek}/7 days</div>
      </div>

      <div className="mt-3 flex items-center justify-between space-x-2">
        {weeklyData.map((d, idx) => (
          <div key={idx} className="flex flex-col items-center text-xs w-8">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${d.hasStudy ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'}`}
              title={d.fullLabel}
            >
              {d.hasStudy ? <Flame className="w-4 h-4 text-white" /> : <span className="text-xs">{d.label}</span>}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">{d.fullLabel}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4 flex items-center justify-between">
        <div className="w-full mr-4 bg-slate-100 rounded-full h-2 overflow-hidden">
          <div className="h-2 rounded-full bg-orange-400 transition-all" style={{ width: `${weeklyProgressPercent}%` }} />
        </div>
        <div className="text-xs text-slate-500 w-12 text-right">{weeklyProgressPercent}%</div>
      </div>

      {/* Stat cards */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="p-3 bg-blue-50 rounded-lg flex flex-col items-center">
            <Award className="w-6 h-6 text-bold text-blue-600" />
          <div className="text-lg font-bold text-slate-800">{currentStreak}</div>
          <div className="text-xs text-slate-500">Best Streak</div>
        </div>

        <div className="p-3 bg-green-50 rounded-lg flex flex-col items-center">
            <TrendingUp className="w-6 h-6 text-bold text-green-600" />
          <div className="text-lg font-bold text-slate-800">{hoursThisWeek}</div>
          <div className="text-xs text-slate-500">This Week</div>
        </div>
      </div>

      {/* Motivation banner */}
      <div className="mt-4 p-3 bg-purple-50 border border-purple-100 rounded-lg flex items-start space-x-3">
        <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center">
          <Zap className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <div className="text-sm font-medium text-purple-700">Streak Motivation</div>
          <div className="text-xs text-purple-600">Good score! 1 day down. Consistency is key!</div>
        </div>
      </div>
    </div>
  );
}
