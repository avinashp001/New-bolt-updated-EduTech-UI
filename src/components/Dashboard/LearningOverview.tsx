import React from 'react';
import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface LearningOverviewProps {
  studySessions: any[];
  tasksCompleted: number;
  pointsEarned: number;
  selectedTimeRange: string;
  setSelectedTimeRange: (range: string) => void;
}

const LearningOverview: React.FC<LearningOverviewProps> = ({
  studySessions,
  tasksCompleted,
  pointsEarned,
  selectedTimeRange,
  setSelectedTimeRange
}) => {
  // Generate chart data based on selected time range
  const generateChartData = () => {
    const days = selectedTimeRange === 'week' ? 7 : selectedTimeRange === 'month' ? 30 : 14;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const daySessions = studySessions.filter(session => 
        session.created_at.split('T')[0] === dateStr
      );
      
      const dailyTasks = daySessions.length;
      const dailyPoints = Math.round(daySessions.reduce((sum, session) => 
        sum + (session.performance_score * session.duration_minutes / 10), 0));
      
      data.push({
        date: date.getDate().toString().padStart(2, '0'),
        fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tasks: dailyTasks,
        points: dailyPoints
      });
    }
    
    return data;
  };

  const chartData = generateChartData();
  const maxTasks = Math.max(...chartData.map(d => d.tasks), 1);
  const maxPoints = Math.max(...chartData.map(d => d.points), 1);

  // Calculate trends
  const recentData = chartData.slice(-7);
  const previousData = chartData.slice(-14, -7);
  
  const recentAvgTasks = recentData.reduce((sum, d) => sum + d.tasks, 0) / 7;
  const previousAvgTasks = previousData.length > 0 ? previousData.reduce((sum, d) => sum + d.tasks, 0) / 7 : 0;
  const tasksTrend = previousAvgTasks > 0 ? ((recentAvgTasks - previousAvgTasks) / previousAvgTasks) * 100 : 0;

  const recentAvgPoints = recentData.reduce((sum, d) => sum + d.points, 0) / 7;
  const previousAvgPoints = previousData.length > 0 ? previousData.reduce((sum, d) => sum + d.points, 0) / 7 : 0;
  const pointsTrend = previousAvgPoints > 0 ? ((recentAvgPoints - previousAvgPoints) / previousAvgPoints) * 100 : 0;

  // Calculate actual tasks completed and points earned from study sessions
  const actualTasksCompleted = studySessions.length;
  const actualPointsEarned = Math.round(studySessions.reduce((sum, session) => 
    sum + (session.performance_score * session.duration_minutes / 10), 0));
  return (
    <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold dark:text-white/80 text-slate-800">Learning Overview</h3>
          <p className="text-slate-600 dark:text-white/40 mt-2 text-sm">Track your progress from first until now</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last 7 days</option>
            <option value="2weeks">Last 14 days</option>
            <option value="month">Last 30 days</option>
          </select>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-sm text-slate-600 dark:text-white/80 mb-1">Task Completed</div>
          <div className="text-2xl font-bold dark:text-white/80 text-slate-800">{actualTasksCompleted.toLocaleString()}</div>
          <div className="flex items-center justify-center space-x-1 mt-1">
            {tasksTrend >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-xs font-medium ${
              tasksTrend >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {Math.abs(tasksTrend).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-slate-600 mb-1 dark:text-white/80">Points Earned</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white/80">{actualPointsEarned.toLocaleString()}</div>
          <div className="flex items-center justify-center space-x-1 mt-1">
            {pointsTrend >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-xs font-medium ${
              pointsTrend >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {Math.abs(pointsTrend).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <Area
              type="monotone"
              dataKey="points"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis hide />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-800 text-white p-3 rounded-lg shadow-lg border border-slate-700">
                      <p className="font-medium">{data.fullDate}</p>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center justify-between space-x-4">
                          <span className="text-blue-300">Tasks:</span>
                          <span className="font-bold">{data.tasks}</span>
                        </div>
                        <div className="flex items-center justify-between space-x-4">
                          <span className="text-green-300">Points:</span>
                          <span className="font-bold">{data.points}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="tasks" 
              stroke="#f59e0b" 
              strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#f59e0b' }}
            />
            <Line 
              type="monotone" 
              dataKey="points" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Hover tooltip indicator */}
        <div className="absolute top-4 right-4 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Tasks</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningOverview;