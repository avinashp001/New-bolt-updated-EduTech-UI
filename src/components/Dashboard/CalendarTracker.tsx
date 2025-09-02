// import React, { useState } from 'react';
// import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

// interface CalendarTrackerProps {
//   studySessions: any[];
// }

// const CalendarTracker: React.FC<CalendarTrackerProps> = ({ studySessions }) => {
//   const [currentDate, setCurrentDate] = useState(new Date());

//   const getDaysInMonth = (date: Date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const daysInMonth = lastDay.getDate();
//     const startingDayOfWeek = firstDay.getDay();

//     const days = [];
    
//     // Add empty cells for days before the first day of the month
//     for (let i = 0; i < startingDayOfWeek; i++) {
//       days.push(null);
//     }
    
//     // Add all days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const dayDate = new Date(year, month, day);
//       const dateStr = dayDate.toISOString().split('T')[0];
      
//       const daySessions = studySessions.filter(session => 
//         session.created_at.split('T')[0] === dateStr
//       );
      
//       const totalMinutes = daySessions.reduce((sum, session) => sum + session.duration_minutes, 0);
//       const hasStudy = daySessions.length > 0;
//       const isToday = dayDate.toDateString() === new Date().toDateString();
      
//       days.push({
//         day,
//         date: dayDate,
//         dateStr,
//         hasStudy,
//         sessions: daySessions.length,
//         totalMinutes,
//         isToday,
//         intensity: Math.min(totalMinutes / 60, 8) // Max 8 hours
//       });
//     }
    
//     return days;
//   };

//   const days = getDaysInMonth(currentDate);
//   const monthName = currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

//   const navigateMonth = (direction: 'prev' | 'next') => {
//     const newDate = new Date(currentDate);
//     if (direction === 'prev') {
//       newDate.setMonth(newDate.getMonth() - 1);
//     } else {
//       newDate.setMonth(newDate.getMonth() + 1);
//     }
//     setCurrentDate(newDate);
//   };

//   const getStudyIntensityClass = (intensity: number) => {
//     if (intensity === 0) return 'bg-slate-100 text-slate-400';
//     if (intensity <= 1) return 'bg-green-200 text-green-800';
//     if (intensity <= 2) return 'bg-green-400 text-white';
//     if (intensity <= 3) return 'bg-green-600 text-white';
//     return 'bg-green-800 text-white';
//   };

//   return (
//     <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center space-x-2">
//           <Calendar className="w-5 h-5 text-blue-600" />
//           <h3 className="text-lg dark:text-white/80 font-bold text-slate-800">{monthName}</h3>
//         </div>
//         <div className="flex items-center space-x-1">
//           <button
//             onClick={() => navigateMonth('prev')}
//             className="p-1 hover:bg-slate-100 rounded transition-colors"
//           >
//             <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-white/80" />
//           </button>
//           <button
//             onClick={() => navigateMonth('next')}
//             className="p-1 hover:bg-slate-100 rounded transition-colors"
//           >
//             <ChevronRight className="w-4 h-4 text-slate-600 dark:text-white/80" />
//           </button>
//         </div>
//       </div>

//       {/* Calendar Grid */}
//       <div className="mb-4">
//         {/* Day headers */}
//         <div className="grid grid-cols-7 gap-1 mb-2">
//           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//             <div key={day} className="text-center text-xs font-medium dark:text-white/80 text-slate-500 py-2">
//               {day}
//             </div>
//           ))}
//         </div>
        
//         {/* Calendar days */}
//         <div className="grid grid-cols-7 gap-1">
//           {days.map((day, index) => (
//             <div key={index} className="aspect-square">
//               {day ? (
//                 <div
//                   className={`w-full h-full rounded-lg flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:scale-105 ${
//                     day.isToday 
//                       ? 'bg-blue-600 text-white ring-2 ring-blue-200' 
//                       : getStudyIntensityClass(day.intensity)
//                   }`}
//                   title={day.hasStudy ? `${day.sessions} sessions, ${Math.round(day.totalMinutes / 60 * 10) / 10}h` : 'No study'}
//                 >
//                   {day.day}
//                 </div>
//               ) : (
//                 <div className="w-full h-full"></div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Legend */}
//       <div className="flex items-center justify-between text-xs text-slate-500">
//         <span>Less</span>
//         <div className="flex items-center space-x-1">
//           <div className="w-3 h-3 bg-slate-100 rounded"></div>
//           <div className="w-3 h-3 bg-green-200 rounded"></div>
//           <div className="w-3 h-3 bg-green-400 rounded"></div>
//           <div className="w-3 h-3 bg-green-600 rounded"></div>
//           <div className="w-3 h-3 bg-green-800 rounded"></div>
//         </div>
//         <span>More</span>
//       </div>
//     </div>
//   );
// };

// export default CalendarTracker;

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CalendarTrackerProps {
  studySessions: any[];
}

const CalendarTracker: React.FC<CalendarTrackerProps> = ({ studySessions }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const dateStr = dayDate.toISOString().split('T')[0];
      
      const daySessions = studySessions.filter(session => 
        session.created_at.split('T')[0] === dateStr
      );
      
      const totalMinutes = daySessions.reduce((sum, session) => sum + session.duration_minutes, 0);
      const hasStudy = daySessions.length > 0;
      const isToday = dayDate.toDateString() === new Date().toDateString();
      
      days.push({
        day,
        date: dayDate,
        dateStr,
        hasStudy,
        sessions: daySessions.length,
        totalMinutes,
        isToday,
      });
    }
    
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getDayCellClass = (dayData: any) => {
    if (!dayData) return ''; // For empty cells

    const baseClasses = 'w-full h-full rounded-lg flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:scale-105';

    if (dayData.isToday) {
      return `${baseClasses} bg-blue-600 text-white ring-2 ring-blue-200`;
    } else if (dayData.hasStudy) {
      // This will be the "Studied" color
      return `${baseClasses} bg-blue-100 border-blue-200 text-blue-800`;
    }
    // Default for days with no study sessions and not today
    return `${baseClasses} bg-white text-slate-400`;
  };

  const totalSessionsThisMonth = days.reduce((sum, day) => sum + (day?.sessions || 0), 0);

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg dark:text-white/80 font-bold text-slate-800">{monthName}</h3>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-white/80" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-slate-600 dark:text-white/80" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-xs font-medium dark:text-white/80 text-slate-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div key={index} className="aspect-square">
              {day ? (
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:scale-105 ${
                    getDayCellClass(day)
                  }`}
                  title={day.hasStudy ? `${day.sessions} sessions, ${Math.round(day.totalMinutes / 60 * 10) / 10}h` : 'No study'}
                >
                  {day.day}
                </div>
              ) : (
                <div className="w-8 h-8"></div> // Empty div for spacing
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Sessions Count */}
      <div className="text-center text-sm text-slate-500 mb-4">
        {totalSessionsThisMonth} sessions this month
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
        <span className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-100 rounded-full border border-blue-200"></div>
          <span>Studied</span>
        </span>
        <span className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-orange-100 rounded-full border border-orange-200"></div>
          <span>Scheduled</span>
        </span>
        <span className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <span>Today</span>
        </span>
      </div>
    </div>
  );
};

export default CalendarTracker;