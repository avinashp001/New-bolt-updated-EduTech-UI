import React from 'react';

interface ActivityRingProps {
  studySessions: any[];
}

const ActivityRing: React.FC<ActivityRingProps> = ({ studySessions }) => {
  // Calculate activity distribution from actual study sessions
  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const recentSessions = studySessions.filter(session => 
    new Date(session.created_at) >= last30Days
  );

  // Group by time of day
  const timeDistribution = {
    morning: 0, // 6-12
    afternoon: 0, // 12-18
    evening: 0, // 18-24
    night: 0, // 0-6
  };

  recentSessions.forEach(session => {
    const hour = new Date(session.created_at).getHours();
    if (hour >= 6 && hour < 12) {
      timeDistribution.morning += session.duration_minutes;
    } else if (hour >= 12 && hour < 18) {
      timeDistribution.afternoon += session.duration_minutes;
    } else if (hour >= 18 && hour < 24) {
      timeDistribution.evening += session.duration_minutes;
    } else {
      timeDistribution.night += session.duration_minutes;
    }
  });

  const totalMinutes = Object.values(timeDistribution).reduce((sum, minutes) => sum + minutes, 0);
  
  const activities = [
    { 
      label: 'Morning', 
      percentage: totalMinutes > 0 ? Math.round((timeDistribution.morning / totalMinutes) * 100) : 0, 
      color: 'stroke-yellow-400',
      minutes: timeDistribution.morning
    },
    { 
      label: 'Afternoon', 
      percentage: totalMinutes > 0 ? Math.round((timeDistribution.afternoon / totalMinutes) * 100) : 0, 
      color: 'stroke-blue-400',
      minutes: timeDistribution.afternoon
    },
    { 
      label: 'Evening', 
      percentage: totalMinutes > 0 ? Math.round((timeDistribution.evening / totalMinutes) * 100) : 0, 
      color: 'stroke-purple-400',
      minutes: timeDistribution.evening
    },
    { 
      label: 'Night', 
      percentage: totalMinutes > 0 ? Math.round((timeDistribution.night / totalMinutes) * 100) : 0, 
      color: 'stroke-indigo-400',
      minutes: timeDistribution.night
    }
  ].filter(activity => activity.percentage > 0); // Only show periods with activity

  // Calculate the cumulative percentages for the ring segments
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  
  let cumulativePercentage = 0;
  const segments = activities.map((activity) => {
    const startAngle = (cumulativePercentage / 100) * 360 - 90;
    const segmentLength = (activity.percentage / 100) * circumference;
    cumulativePercentage += activity.percentage;
    
    return {
      ...activity,
      startAngle,
      segmentLength,
      strokeDasharray: `${segmentLength} ${circumference - segmentLength}`,
      strokeDashoffset: -((cumulativePercentage - activity.percentage) / 100) * circumference
    };
  });

  if (totalMinutes === 0) {
    return (
      <div className="bg-slate-800 p-6 rounded-2xl text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Study Time Distribution</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-20 h-20 border-4 border-slate-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">⏰</span>
          </div>
          <p className="text-slate-300">No study activity yet</p>
          <p className="text-slate-400 text-sm">Start studying to see your time patterns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-4 lg:p-6 rounded-2xl text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base lg:text-lg font-semibold">Study Time Distribution</h3>
        <div className="text-xs text-slate-400">Last 30 days</div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div className="relative w-24 sm:w-32 h-24 sm:h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-700"
            />
            
            {/* Activity segments */}
            {segments.map((segment, index) => (
              <circle
                key={index}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                strokeWidth="8"
                className={segment.color}
                strokeDasharray={segment.strokeDasharray}
                strokeDashoffset={segment.strokeDashoffset}
                strokeLinecap="round"
              />
            ))}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-base sm:text-lg font-bold">{Math.round(totalMinutes / 60)}h</div>
              <div className="text-xs text-slate-400">Total</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-2 sm:space-x-3">
              <div 
                className={`w-3 h-3 rounded-full ${
                  index === 0 ? 'bg-yellow-400' : 
                  index === 1 ? 'bg-blue-400' : 'bg-purple-400'
                }`} 
              />
              <div>
                <div className="text-xs sm:text-sm font-bold">{activity.percentage}%</div>
                <div className="text-xs text-slate-400">{activity.label}</div>
                <div className="text-xs text-slate-500 hidden sm:block">{Math.round(activity.minutes / 60)}h</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityRing;