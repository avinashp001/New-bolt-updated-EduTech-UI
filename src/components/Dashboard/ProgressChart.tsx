import React from 'react';

interface ProgressChartProps {
  studySessions: any[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ studySessions }) => {
  // Get last 7 days of data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const chartData = last7Days.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    const daySessions = studySessions.filter(session => 
      session.created_at.split('T')[0] === dateStr
    );
    
    const totalMinutes = daySessions.reduce((sum, session) => sum + session.duration_minutes, 0);
    const avgPerformance = daySessions.length > 0 
      ? daySessions.reduce((sum, session) => sum + session.performance_score, 0) / daySessions.length 
      : 0;
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      hours: Math.round((totalMinutes / 60) * 100) / 100,
      performance: Math.round(avgPerformance * 100) / 100,
      sessions: daySessions.length
    };
  });

  const maxHours = Math.max(...chartData.map(d => d.hours), 1);

  if (studySessions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Study Progress</h3>
        <div className="h-48 flex items-center justify-center text-slate-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <p className="font-medium">No study sessions yet</p>
            <p className="text-sm">Start studying to see your progress here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-slate-800">Study Progress (Last 7 Days)</h3>
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-slate-800 rounded"></div>
              <span className="text-sm text-slate-600">Study Hours</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-300 rounded"></div>
              <span className="text-sm text-slate-600">Performance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Legend */}
      <div className="lg:hidden flex items-center justify-center space-x-6 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-slate-800 rounded"></div>
          <span className="text-sm text-slate-600">Hours</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-300 rounded"></div>
          <span className="text-sm text-slate-600">Performance</span>
        </div>
      </div>

      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-400 hidden sm:flex">
          <span>{Math.ceil(maxHours)}h</span>
          <span>{Math.ceil(maxHours * 0.75)}h</span>
          <span>{Math.ceil(maxHours * 0.5)}h</span>
          <span>{Math.ceil(maxHours * 0.25)}h</span>
          <span>0h</span>
        </div>

        {/* Chart area */}
        <div className="ml-2 sm:ml-8 h-32 sm:h-48 flex items-end justify-between space-x-1 sm:space-x-4">
          {chartData.map((day, index) => (
            <div key={index} className="flex flex-col items-center space-y-1 sm:space-y-2 flex-1">
              <div className="flex space-x-1 items-end h-24 sm:h-40">
                {/* Study hours bar */}
                <div
                  className="w-3 sm:w-6 bg-slate-800 rounded-t transition-all duration-300 hover:bg-slate-700"
                  style={{
                    height: `${Math.max((day.hours / maxHours) * 100, 2)}%`,
                  }}
                  title={`${day.hours.toFixed(1)} hours studied`}
                />
                {/* Performance bar (scaled to 10) */}
                <div
                  className="w-3 sm:w-6 bg-purple-300 rounded-t transition-all duration-300 hover:bg-purple-400"
                  style={{
                    height: `${Math.max((day.performance / 10) * 100, 2)}%`,
                  }}
                  title={`Performance: ${day.performance.toFixed(1)}/10`}
                />
              </div>
              <span className="text-xs text-slate-500 text-center">{day.date}</span>
              <span className="text-xs text-slate-400 text-center hidden sm:block">{day.sessions} sessions</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;