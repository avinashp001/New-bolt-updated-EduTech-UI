import React from 'react';
import { Award, Target, CheckCircle, Trophy } from 'lucide-react';

interface PerformanceRingProps {
  overallProgress: number;
  avgPerformance: number;
  studySessions: any[];
}

const PerformanceRing: React.FC<PerformanceRingProps> = ({
  overallProgress,
  avgPerformance,
  studySessions
}) => {
  // Calculate actual tasks completed and points earned from study sessions
  const tasksCompleted = studySessions.length;
  const pointsEarned = Math.round(studySessions.reduce((sum, session) => 
    sum + (session.performance_score * session.duration_minutes / 10), 0));

  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (overallProgress / 100) * circumference;
  const performanceOffset = circumference - (avgPerformance / 10) * circumference;

  return (
    <div className="bg-white/90 dark:bg-slate-900/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl dark:text-white/80 font-bold text-slate-800">Average Performance</h3>
          <p className="text-slate-600 dark:text-white/80 text-sm">How's your percentage performance so far</p>
        </div>
      </div>

      {/* Performance Ring */}
      <div className="relative flex items-center justify-center mb-6">
        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
          {/* Background rings */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
             stroke="#e5e7eb"
            strokeWidth="10"
          />


          {/* Define circular gradient */}
  <defs>
    <linearGradient id="progressGradient" gradientTransform="rotate(90)">
      {/* <stop offset="0%" stopColor="#67b037" /> */}
      <stop offset="0%" stopColor="#67b037" />
      {/* Remaining 75% Green */}
      {/* <stop offset="25%" stopColor="#f97316" /> */}
      <stop offset="100%" stopColor="#f97316" />
    </linearGradient>
  </defs>

          
         
  {/* Progress circle */}
  <circle
    cx="100"
    cy="100"
    r={radius}
    fill="none"
    stroke="url(#progressGradient)"
    strokeWidth="10"
    strokeDasharray={circumference}
    strokeDashoffset={progressOffset}
    strokeLinecap="round"
    className="transition-all duration-1000 ease-out"
  />
          
          {/* Performance ring (inner) */}
          {/* <circle
            cx="100"
            cy="100"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={performanceOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          /> */}
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-6 h-6 text-slate-800 " />
            </div>
            
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-green-700 rounded-full"></div>
            <span className="text-sm dark:text-slate-300 font-medium text-slate-700">{pointsEarned.toLocaleString()}</span>
          </div>
          <div className="text-xs dark:text-slate-300 text-slate-500">Points</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
            <span className="text-sm dark:text-slate-300 font-medium text-slate-700">{tasksCompleted.toLocaleString()}</span>
          </div>
          <div className="text-xs dark:text-slate-300 text-slate-500">Tasks</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-medium text-slate-800">Study Progress</div>
              <div className="text-xs text-slate-600">Overall completion</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-800">{overallProgress}%</div>
            <div className="text-xs text-slate-500">Complete</div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-medium text-slate-800">Avg Performance</div>
              <div className="text-xs text-slate-600">Session quality</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-800">{avgPerformance}/10</div>
            <div className="text-xs text-slate-500">Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceRing;