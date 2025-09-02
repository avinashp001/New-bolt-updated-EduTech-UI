import React from 'react';
import { MoreHorizontal, Clock } from 'lucide-react';

interface StudyTimeHeatmapProps {
  studySessions: any[];
}

const StudyTimeHeatmap: React.FC<StudyTimeHeatmapProps> = ({ studySessions }) => {
  // Generate heatmap data for the last 7 days and 24 hours
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const date = new Date(today);
      date.setDate(today.getDate() - dayOffset);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Adjust for Monday start
      
      const dayData = {
        day: dayName,
        date: dateStr,
        hours: []
      };
      
      // Create hourly data (0-23 hours, but show key hours)
      const keyHours = [0, 4, 8, 12, 16, 20]; // 6 time slots
      const hourLabels = ['12am', '4am', '8am', '12pm', '4pm', '8pm'];
      
      for (let i = 0; i < keyHours.length; i++) {
        const hour = keyHours[i];
        const hourLabel = hourLabels[i];
        
        // Find sessions in this hour range (4-hour blocks)
        const hourSessions = studySessions.filter(session => {
          const sessionDate = new Date(session.created_at);
          const sessionDateStr = sessionDate.toISOString().split('T')[0];
          const sessionHour = sessionDate.getHours();
          
          return sessionDateStr === dateStr && 
                 sessionHour >= hour && 
                 sessionHour < (hour + 4);
        });
        
        const totalMinutes = hourSessions.reduce((sum, session) => sum + session.duration_minutes, 0);
        const intensity = Math.min(totalMinutes / 60, 4); // Max 4 hours per block
        
        dayData.hours.push({
          hour: hourLabel,
          intensity: intensity,
          sessions: hourSessions.length,
          totalMinutes
        });
      }
      
      data.push(dayData);
    }
    
    return data;
  };

  const heatmapData = generateHeatmapData();
  const maxIntensity = Math.max(...heatmapData.flatMap(day => day.hours.map(h => h.intensity)), 1);

  const getIntensityColor = (intensity: number) => {
    const normalizedIntensity = intensity / maxIntensity;
    if (normalizedIntensity === 0) return 'bg-slate-100';
    if (normalizedIntensity <= 0.25) return 'bg-blue-200';
    if (normalizedIntensity <= 0.5) return 'bg-blue-400';
    if (normalizedIntensity <= 0.75) return 'bg-blue-600';
    return 'bg-blue-800';
  };

  // Calculate best and worst performance times
  const allHourData = heatmapData.flatMap(day => 
    day.hours.map(hour => ({ ...hour, day: day.day }))
  );
  
  const bestTime = allHourData.reduce((best, current) => 
    current.intensity > best.intensity ? current : best, allHourData[0] || { hour: '8am', intensity: 0 }
  );
  
  const worstTime = allHourData.filter(h => h.intensity > 0).reduce((worst, current) => 
    current.intensity < worst.intensity ? current : worst, allHourData.find(h => h.intensity > 0) || { hour: '8pm', intensity: 0 }
  );

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl dark:text-white/80 font-bold text-slate-800">Study Time</h3>
          <span className="text-slate-600 dark:text-white/80 text-sm">Last 7 days heatmap</span>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Heatmap Grid */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {heatmapData.map((day, dayIndex) => (
            <div key={dayIndex} className="text-center">
              <div className="text-xs font-medium text-slate-600 dark:text-white/80 mb-2">{day.day}</div>
              <div className="space-y-1">
                {day.hours.map((hour, hourIndex) => (
                  <div
                    key={hourIndex}
                    className={`w-8 h-6 rounded ${getIntensityColor(hour.intensity)} transition-all hover:scale-110 cursor-pointer`}
                    title={`${day.day} ${hour.hour}: ${hour.totalMinutes}min (${hour.sessions} sessions)`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Time labels */}
        <div className="flex justify-between space-x-3 text-xs text-slate-500 mt-2">
          <span>12am</span>
          <span>04am</span>
          <span>08pm</span>
          <span>12pm</span>
          <span>04pm</span>
          <span>08pm</span>
          <span>12am</span>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <div className="text-lg font-bold text-green-700">{bestTime?.hour || '8am'}</div>
          <div className="text-xs text-green-600">Best Performance</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
          <div className="text-lg font-bold text-red-700">{worstTime?.hour || '6pm'}</div>
          <div className="text-xs text-red-600">Worst Performance</div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimeHeatmap;