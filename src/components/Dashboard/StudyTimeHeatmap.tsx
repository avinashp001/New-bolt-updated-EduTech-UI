// import React from 'react';
// import { MoreHorizontal, Clock } from 'lucide-react';

// interface StudyTimeHeatmapProps {
//   studySessions: any[];
// }

// const StudyTimeHeatmap: React.FC<StudyTimeHeatmapProps> = ({ studySessions }) => {
//   // Generate heatmap data for the last 7 days and 24 hours
//   const generateHeatmapData = () => {
//     const data = [];
//     const today = new Date();
//     const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
//     for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
//       const date = new Date(today);
//       date.setDate(today.getDate() - dayOffset);
//       const dateStr = date.toISOString().split('T')[0];
//       const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Adjust for Monday start
      
//       const dayData = {
//         day: dayName,
//         date: dateStr,
//         hours: []
//       };
      
//       // Create hourly data (0-23 hours, but show key hours)
//       const keyHours = [0, 4, 8, 12, 16, 20]; // 6 time slots
//       const hourLabels = ['12am', '4am', '8am', '12pm', '4pm', '8pm'];
      
//       for (let i = 0; i < keyHours.length; i++) {
//         const hour = keyHours[i];
//         const hourLabel = hourLabels[i];
        
//         // Find sessions in this hour range (4-hour blocks)
//         const hourSessions = studySessions.filter(session => {
//           const sessionDate = new Date(session.created_at);
//           const sessionDateStr = sessionDate.toISOString().split('T')[0];
//           const sessionHour = sessionDate.getHours();
          
//           return sessionDateStr === dateStr && 
//                  sessionHour >= hour && 
//                  sessionHour < (hour + 4);
//         });
        
//         const totalMinutes = hourSessions.reduce((sum, session) => sum + session.duration_minutes, 0);
//         const intensity = Math.min(totalMinutes / 60, 4); // Max 4 hours per block
        
//         dayData.hours.push({
//           hour: hourLabel,
//           intensity: intensity,
//           sessions: hourSessions.length,
//           totalMinutes
//         });
//       }
      
//       data.push(dayData);
//     }
    
//     return data;
//   };

//   const heatmapData = generateHeatmapData();
//   const maxIntensity = Math.max(...heatmapData.flatMap(day => day.hours.map(h => h.intensity)), 1);

//   const getIntensityColor = (intensity: number) => {
//     const normalizedIntensity = intensity / maxIntensity;
//     if (normalizedIntensity === 0) return 'bg-slate-100';
//     if (normalizedIntensity <= 0.25) return 'bg-orange-200';
//     if (normalizedIntensity <= 0.5) return 'bg-orange-400';
//     if (normalizedIntensity <= 0.75) return 'bg-red-500';
//     return 'bg-red-700';
//   };

//   // Calculate best and worst performance times
//   const allHourData = heatmapData.flatMap(day => 
//     day.hours.map(hour => ({ ...hour, day: day.day }))
//   );
  
//   const bestTime = allHourData.reduce((best, current) => 
//     current.intensity > best.intensity ? current : best, allHourData[0] || { hour: '8am', intensity: 0 }
//   );
  
//   const worstTime = allHourData.filter(h => h.intensity > 0).reduce((worst, current) => 
//     current.intensity < worst.intensity ? current : worst, allHourData.find(h => h.intensity > 0) || { hour: '8pm', intensity: 0 }
//   );

//   return (
//     <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h3 className="text-xl dark:text-white/80 font-bold text-slate-800">Study Time</h3>
//           <span className="text-slate-600 dark:text-white/80 text-sm">Last 7 days heatmap</span>
//         </div>
//         <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
//           <MoreHorizontal className="w-5 h-5 text-slate-600" />
//         </button>
//       </div>

//       {/* Heatmap Grid */}
//       <div className="mb-6">
//         <div className="grid grid-cols-9 gap-1 mb-2">
//           {heatmapData.map((day, dayIndex) => (
//             <div key={dayIndex} className="text-center">
//               <div className="text-xs font-medium text-slate-600 dark:text-white/80 mb-2">{day.day}</div>
//               <div className="space-y-1">
//                 {day.hours.map((hour, hourIndex) => (
//                   <div
//                     key={hourIndex}
//                     className={`w-8 h-6 rounded ${getIntensityColor(hour.intensity)} transition-all hover:scale-110 cursor-pointer`}
//                     title={`${day.day} ${hour.hour}: ${hour.totalMinutes}min (${hour.sessions} sessions)`}
//                   />
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
        
//         {/* Time labels */}
//         <div className="flex justify-between space-x-3 text-xs text-slate-500 mt-2">
//           <span>12am</span>
//           <span>04am</span>
//           <span>08pm</span>
//           <span>12pm</span>
//           <span>04pm</span>
//           <span>08pm</span>
//           <span>12am</span>
//         </div>
//       </div>

//       {/* Performance Summary */}
//       <div className="grid grid-cols-2 gap-4">
//         <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
//           <div className="text-lg font-bold text-green-700">{bestTime?.hour || '8am'}</div>
//           <div className="text-xs text-green-600">Best Performance</div>
//         </div>
//         <div className="text-center p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
//           <div className="text-lg font-bold text-red-700">{worstTime?.hour || '6pm'}</div>
//           <div className="text-xs text-red-600">Worst Performance</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudyTimeHeatmap;




import React from 'react';
import { MoreHorizontal, Clock } from 'lucide-react';

interface StudyTimeHeatmapProps {
  studySessions: any[];
}

const StudyTimeHeatmap: React.FC<StudyTimeHeatmapProps> = ({ studySessions }) => {
  // Generate heatmap data for the last 7 days and specific hours
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    // Days of the week starting from Monday (0=Sunday, 1=Monday, ..., 6=Saturday)
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Hours to display (6 PM to 1 AM)
    const keyHours = [18, 19, 20, 21, 22, 23, 0, 1]; // 6PM, 7PM, ..., 11PM, 12AM, 1AM
    const hourLabels = ['6P', '7P', '8P', '9P', '10P', '11P', '12P', '1A'];

    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const date = new Date(today);
      date.setDate(today.getDate() - dayOffset);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = daysOfWeek[date.getDay()];
      
      const dayData = {
        day: dayName,
        date: dateStr,
        hours: []
      };
      
      for (let i = 0; i < keyHours.length; i++) {
        const hour = keyHours[i];
        const hourLabel = hourLabels[i];
        
        // Find sessions in this specific hour
        const hourSessions = studySessions.filter(session => {
          const sessionDate = new Date(session.created_at);
          const sessionDateStr = sessionDate.toISOString().split('T')[0];
          const sessionHour = sessionDate.getHours();
          
          return sessionDateStr === dateStr && sessionHour === hour;
        });
        
        const totalMinutes = hourSessions.reduce((sum, session) => sum + session.duration_minutes, 0);
        // Max 4 hours per hour slot for visual scaling
        const intensity = Math.min(totalMinutes / 60, 4); 
        
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
    if (normalizedIntensity <= 0.25) return 'bg-orange-200';
    if (normalizedIntensity <= 0.5) return 'bg-orange-400';
    if (normalizedIntensity <= 0.75) return 'bg-red-500';
    return 'bg-red-700';
  };

  // Calculate best and worst performance times
  const allHourData = heatmapData.flatMap(day => 
    day.hours.map(hour => ({ ...hour, day: day.day }))
  );
  
  // Filter out entries with 0 intensity for worstTime calculation
  const activeHourData = allHourData.filter(h => h.intensity > 0);

  const bestTime = allHourData.reduce((best, current) => 
    current.intensity > best.intensity ? current : best, allHourData[0] || { hour: '6P', intensity: 0 }
  );
  
  const worstTime = activeHourData.length > 0 
    ? activeHourData.reduce((worst, current) => 
        current.intensity < worst.intensity ? current : worst, activeHourData[0]
      )
    : { hour: '1A', intensity: 0 }; // Fallback if no active hours

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl dark:text-white/80 font-bold text-slate-800">Study Time</h3>
          <span className="text-slate-600 dark:text-white/80 text-sm">Daily base</span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Static "Daily base" dropdown as per image */}
          <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex items-center space-x-1">
            <span>Daily base</span>
            <Clock className="w-4 h-4 text-slate-600" />
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="mb-6">
        {/* Hour labels at the top */}
        <div className="grid grid-cols-9 gap-1 mb-2">
          <div className="col-span-1"></div> {/* Empty cell for day labels */}
          {['6P', '7P', '8P', '9P', '10P', '11P', '12P', '1A'].map((label, index) => (
            <div key={index} className="text-center text-xs font-medium text-slate-500">
              {label}
            </div>
          ))}
        </div>

        {/* Calendar days and hour bars */}
        <div className="grid grid-cols-9 gap-1">
          {heatmapData.map((day, dayIndex) => (
            <React.Fragment key={dayIndex}>
              {/* Day label */}
              <div className="col-span-1 text-right pr-2 text-xs font-medium text-slate-600 dark:text-white/80 flex items-center justify-end">
                {day.day}
              </div>
              {/* Hour bars */}
              {day.hours.map((hour, hourIndex) => (
                <div key={hourIndex} className="col-span-1 flex items-end justify-center h-16">
                  <div
                    className={`w-6 rounded-t ${getIntensityColor(hour.intensity)} transition-all hover:scale-105 cursor-pointer`}
                    style={{ height: `${(hour.intensity / maxIntensity) * 100}%` }}
                    title={`${day.day} ${hour.hour}: ${Math.round(hour.totalMinutes)}min (${hour.sessions} sessions)`}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="relative w-full h-4 bg-gradient-to-r from-orange-300 to-red-500 rounded-full mb-4">
        {/* Best Performance Indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
          style={{ left: `${(bestTime.intensity / maxIntensity) * 100}%` }}
          title={`Best Performance: ${bestTime.hour} (${Math.round(bestTime.intensity * 60)}min)`}
        />
        {/* Worst Performance Indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
          style={{ left: `${(worstTime.intensity / maxIntensity) * 100}%` }}
          title={`Worst Performance: ${worstTime.hour} (${Math.round(worstTime.intensity * 60)}min)`}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500 mb-6">
        <span className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Best Performance</span>
        </span>
        <span className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Worst Performance</span>
        </span>
      </div>

      {/* Study Pattern */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-center space-x-3 mb-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-blue-800">Study Pattern</h4>
        </div>
        <p className="text-sm text-blue-700">
          Build a consistent study routine to identify your peak performance hours.
        </p>
      </div>
    </div>
  );
};

export default StudyTimeHeatmap;