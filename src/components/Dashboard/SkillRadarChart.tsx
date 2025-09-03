// import React from 'react';
// import { MoreHorizontal, TrendingUp } from 'lucide-react';

// interface SkillRadarChartProps {
//   progressReports: any[];
// }

// const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ progressReports }) => {
//   // Get top 6 subjects for radar chart
//   const topSubjects = progressReports
//     .sort((a, b) => (b.completion_percentage || 0) - (a.completion_percentage || 0))
//     .slice(0, 6);

//   // Ensure we have 6 skills for the radar chart
//   const skills = [
//     ...topSubjects.map(report => ({
//       name: report.subject.length > 12 ? report.subject.substring(0, 12) + '...' : report.subject,
//       fullName: report.subject,
//       value: report.completion_percentage || 0,
//       color: '#3b82f6'
//     })),
//     // Fill remaining slots if needed
//     ...Array.from({ length: Math.max(0, 6 - topSubjects.length) }, (_, i) => ({
//       name: `Skill ${topSubjects.length + i + 1}`,
//       fullName: `Skill ${topSubjects.length + i + 1}`,
//       value: 0,
//       color: '#e2e8f0'
//     }))
//   ].slice(0, 6);

//   // Calculate radar chart points
//   const centerX = 120;
//   const centerY = 120;
//   const maxRadius = 80;
  
//   const radarPoints = skills.map((skill, index) => {
//     const angle = (index * 60 - 90) * (Math.PI / 180); // 60 degrees apart, starting from top
//     const radius = (skill.value / 100) * maxRadius;
//     const x = centerX + radius * Math.cos(angle);
//     const y = centerY + radius * Math.sin(angle);
    
//     // Label position (slightly outside the max radius)
//     const labelRadius = maxRadius + 20;
//     const labelX = centerX + labelRadius * Math.cos(angle);
//     const labelY = centerY + labelRadius * Math.sin(angle);
    
//     return {
//       ...skill,
//       x,
//       y,
//       labelX,
//       labelY,
//       angle: angle * (180 / Math.PI)
//     };
//   });

//   // Create path for the filled area
//   const pathData = radarPoints.map((point, index) => 
//     `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
//   ).join(' ') + ' Z';

//   // Create grid lines (concentric hexagons)
//   const gridLevels = [20, 40, 60, 80, 100];
  
//   return (
//     <div className="bg-white/70 dark:bg-slate-900 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h3 className="text-xl font-bold dark:text-white/80 text-slate-800">Skill Developed</h3>
//           <button 
//             onClick={() => window.location.href = '/analytics'}
//             className="text-blue-600 dark:text-sky-600/80 text-sm font-medium hover:text-blue-700 transition-colors"
//           >
//             See Details
//           </button>
//         </div>
//         <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
//           <MoreHorizontal className="w-5 h-5 text-slate-600" />
//         </button>
//       </div>

//       {/* Radar Chart */}
//       <div className="flex justify-center mb-6">
//         <svg width="240" height="240" className="overflow-visible">
//           {/* Grid lines */}
//           {gridLevels.map((level, levelIndex) => {
//             const gridRadius = (level / 100) * maxRadius;
//             const gridPoints = Array.from({ length: 6 }, (_, i) => {
//               const angle = (i * 60 - 90) * (Math.PI / 180);
//               const x = centerX + gridRadius * Math.cos(angle);
//               const y = centerY + gridRadius * Math.sin(angle);
//               return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
//             }).join(' ') + ' Z';
            
//             return (
//               <path
//                 key={levelIndex}
//                 d={gridPoints}
//                 fill="none"
//                 stroke="#e2e8f0"
//                 strokeWidth="1"
//                 opacity={0.5}
//               />
//             );
//           })}
          
//           {/* Axis lines */}
//           {radarPoints.map((point, index) => (
//             <line
//               key={index}
//               x1={centerX}
//               y1={centerY}
//               x2={centerX + maxRadius * Math.cos((index * 60 - 90) * (Math.PI / 180))}
//               y2={centerY + maxRadius * Math.sin((index * 60 - 90) * (Math.PI / 180))}
//               stroke="#e2e8f0"
//               strokeWidth="1"
//               opacity={0.5}
//             />
//           ))}
          
//           {/* Filled area */}
//           <path
//             d={pathData}
//             fill="rgba(59, 130, 246, 0.1)"
//             stroke="#3b82f6"
//             strokeWidth="2"
//           />
          
//           {/* Data points */}
//           {radarPoints.map((point, index) => (
//             <circle
//               key={index}
//               cx={point.x}
//               cy={point.y}
//               r="4"
//               fill="#3b82f6"
//               stroke="#ffffff"
//               strokeWidth="2"
//             />
//           ))}
          
//           {/* Labels */}
//           {radarPoints.map((point, index) => (
//             <text
//               key={index}
//               x={point.labelX}
//               y={point.labelY}
//               textAnchor="middle"
//               dominantBaseline="middle"
//               className="text-xs font-medium fill-slate-700"
//             >
//               {point.name}
//             </text>
//           ))}
//         </svg>
//       </div>

//       {/* Skills List */}
//       <div className="space-y-2">
//         {skills.slice(0, 3).map((skill, index) => (
//           <div key={index} className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className={`w-3 h-3 rounded-full ${
//                 skill.value > 0 ? 'bg-blue-500' : 'bg-slate-300'
//               }`} />
//               <span className="text-sm font-medium dark:text-slate-50/70 text-slate-700">{skill.fullName}</span>
//             </div>
//             <div className="text-sm font-bold dark:text-slate-50/70 text-slate-800">{skill.value}%</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SkillRadarChart;

// src/components/Dashboard/SkillRadarChart.tsx
import React from 'react';
import { MoreHorizontal, TrendingUp } from 'lucide-react';

interface SkillRadarChartProps {
  progressReports: any[];
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ progressReports }) => {
  const MAX_RADAR_SUBJECTS = 9; // Maximum number of subjects to display on the radar chart

  // Filter out reports without a valid completion_percentage, then sort and slice
  const displaySubjects = progressReports
    .filter(report => report.completion_percentage !== undefined && report.completion_percentage !== null)
    .sort((a, b) => (b.completion_percentage || 0) - (a.completion_percentage || 0))
    .slice(0, Math.min(progressReports.length, MAX_RADAR_SUBJECTS));

  // Map displaySubjects directly to skills
  const skills = displaySubjects.map(report => ({
    name: report.subject.length > 12 ? report.subject.substring(0, 12) + '...' : report.subject,
    fullName: report.subject,
    value: report.completion_percentage || 0,
    color: '#3b82f6'
  }));

  // If there are fewer than 3 subjects, a radar chart is not meaningful
  if (skills.length < 1) {
    return (
      <div className="bg-white/70 dark:bg-slate-900 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold dark:text-white/80 text-slate-800">Subject's Performance</h3>
            <button
              onClick={() => window.location.href = '/app/analytics'}
              className="text-blue-600 dark:text-sky-600/80 text-sm font-medium hover:text-blue-700 transition-colors"
            >
              See Details
            </button>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="text-center py-8">
          <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-white/50 font-medium">Not enough subjects to display radar chart</p>
          <p className="text-slate-500 dark:text-white/50 text-sm">Start studying more subjects to see your skill radar!</p>
        </div>
      </div>
    );
  }

  // Calculate radar chart points
  const centerX = 120;
  const centerY = 120;
  const maxRadius = 80;
  const angleIncrement = 360 / skills.length; // Dynamic angle increment

  const radarPoints = skills.map((skill, index) => {
    const angle = (index * angleIncrement - 90) * (Math.PI / 180); // Dynamic angle
    const radius = (skill.value / 100) * maxRadius;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    // Label position (slightly outside the max radius)
    const labelRadius = maxRadius + 20;
    const labelX = centerX + labelRadius * Math.cos(angle);
    const labelY = centerY + labelRadius * Math.sin(angle);

    return {
      ...skill,
      x,
      y,
      labelX,
      labelY,
      angle: angle * (180 / Math.PI)
    };
  });

  // Create path for the filled area
  const pathData = radarPoints.map((point, index) =>
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') + ' Z';

  // Create grid lines (concentric polygons with dynamic sides)
  const gridLevels = [20, 40, 60, 80, 100];

  return (
    <div className="bg-white/70 dark:bg-slate-900 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold dark:text-white/80 text-slate-800">Subject's Performance</h3>
          <button
            onClick={() => window.location.href = '/analytics'}
            className="text-blue-600 dark:text-sky-600/80 text-sm font-medium hover:text-blue-700 transition-colors"
          >
            See Details
          </button>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Radar Chart */}
      <div className="flex justify-center mb-6">
        <svg width="240" height="240" className="overflow-visible">
          {/* Grid lines */}
          {gridLevels.map((level, levelIndex) => {
            const gridRadius = (level / 100) * maxRadius;
            const gridPoints = Array.from({ length: skills.length }, (_, i) => { // Dynamic number of sides
              const angle = (i * angleIncrement - 90) * (Math.PI / 180); // Dynamic angle
              const x = centerX + gridRadius * Math.cos(angle);
              const y = centerY + gridRadius * Math.sin(angle);
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ') + ' Z';

            return (
              <path
                key={levelIndex}
                d={gridPoints}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
                opacity={0.5}
              />
            );
          })}

          {/* Axis lines */}
          {radarPoints.map((point, index) => (
            <line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={centerX + maxRadius * Math.cos((index * angleIncrement - 90) * (Math.PI / 180))} // Dynamic angle
              y2={centerY + maxRadius * Math.sin((index * angleIncrement - 90) * (Math.PI / 180))} // Dynamic angle
              stroke="#e2e8f0"
              strokeWidth="1"
              opacity={0.5}
            />
          ))}

          {/* Filled area */}
          <path
            d={pathData}
            fill="rgba(59, 130, 246, 0.1)"
            stroke="#3b82f6"
            strokeWidth="2"
          />

          {/* Data points */}
          {radarPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
              stroke="#ffffff"
              strokeWidth="2"
            />
          ))}

          {/* Labels */}
          {radarPoints.map((point, index) => (
            <text
              key={index}
              x={point.labelX}
              y={point.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-medium fill-slate-700"
            >
              {point.name}
            </text>
          ))}
        </svg>
      </div>

      {/* Skills List */}
      <div className="space-y-2">
        {skills.slice(0, 3).map((skill, index) => ( // Display top 3 skills in list
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                skill.value > 0 ? 'bg-blue-500' : 'bg-slate-300'
              }`} />
              <span className="text-sm font-medium dark:text-slate-50/70 text-slate-700">{skill.fullName}</span>
            </div>
            <div className="text-sm font-bold dark:text-slate-50/70 text-slate-800">{skill.value}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillRadarChart;
