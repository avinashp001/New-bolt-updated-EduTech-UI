import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Clock, Activity, Target, TrendingUp, BookOpen, Award } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';

interface RealTimeAnalyticsProps {
  userId: string;
}

const RealTimeAnalytics: React.FC<RealTimeAnalyticsProps> = ({ userId }) => {
  const { detailedSchedule, loading: detailedScheduleLoading } = useDetailedSchedule(userId);
  const { 
    studySessions, 
    progressReports, 
    getOverallProgress, 
    getWeeklyStudyHours,
    getTotalStudyHours,
    getAveragePerformance,
    loading
  } = useProgress(userId, detailedSchedule, detailedScheduleLoading);

  // Process data for charts
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyStudyData = last7Days.map(date => {
    const daySessions = studySessions.filter(session => 
      session.created_at.split('T')[0] === date
    );
    const totalMinutes = daySessions.reduce((sum, session) => sum + session.duration_minutes, 0);
    const avgPerformance = daySessions.length > 0 
      ? daySessions.reduce((sum, session) => sum + session.performance_score, 0) / daySessions.length 
      : 0;
    
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      hours: Math.round((totalMinutes / 60) * 10) / 10,
      sessions: daySessions.length,
      performance: Math.round(avgPerformance * 10) / 10,
    };
  });

  const subjectPerformance = progressReports.map(report => ({
    subject: report.subject,
    progress: report.completion_percentage || 0,
    weakAreas: report.weak_areas?.length || 0,
    strongAreas: report.strong_areas?.length || 0,
  }));

  // Subject distribution for pie chart
  const subjectHours = studySessions.reduce((acc, session) => {
    acc[session.subject] = (acc[session.subject] || 0) + session.duration_minutes;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(subjectHours).map(([subject, minutes]) => ({
    name: subject,
    value: Math.round(minutes / 60 * 10) / 10,
    hours: Math.round(minutes / 60 * 10) / 10,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  const overallProgress = getOverallProgress();
  const weeklyHours = getWeeklyStudyHours();
  const totalHours = getTotalStudyHours();
  const avgPerformance = getAveragePerformance();

  // Performance trend data
  const performanceTrend = studySessions.slice(-10).map((session, index) => ({
    session: `S${index + 1}`,
    score: session.performance_score,
    subject: session.subject,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-2xl text-white">
        <h2 className="text-2xl font-bold mb-2">Real-Time Analytics Dashboard</h2>
        <p className="text-blue-100">Track your study progress with detailed insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-slate-600">Overall Progress</p>
              <p className="text-xl lg:text-2xl font-bold text-slate-900">{overallProgress}%</p>
              <p className="text-xs text-slate-500 mt-1 hidden lg:block">
                {progressReports.length} subjects tracked
              </p>
            </div>
            <div className="p-2 lg:p-3 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-slate-600">Weekly Hours</p>
              <p className="text-xl lg:text-2xl font-bold text-slate-900">{weeklyHours}h</p>
              <p className="text-xs text-slate-500 mt-1 hidden lg:block">
                Total: {totalHours}h
              </p>
            </div>
            <div className="p-2 lg:p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-slate-600">Avg Performance</p>
              <p className="text-xl lg:text-2xl font-bold text-slate-900">{avgPerformance}/10</p>
              <p className="text-xs text-slate-500 mt-1 hidden lg:block">
                Last {studySessions.length} sessions
              </p>
            </div>
            <div className="p-2 lg:p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-slate-600">Total Sessions</p>
              <p className="text-xl lg:text-2xl font-bold text-slate-900">{studySessions.length}</p>
              <p className="text-xs text-slate-500 mt-1 hidden lg:block">
                {studySessions.filter(s => {
                  const today = new Date().toDateString();
                  return new Date(s.created_at).toDateString() === today;
                }).length} today
              </p>
            </div>
            <div className="p-2 lg:p-3 bg-orange-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Daily Study Hours Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-base lg:text-lg font-semibold text-slate-800 mb-4">Daily Study Hours (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStudyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [
                  `${value}${name === 'hours' ? 'h' : name === 'performance' ? '/10' : ''}`,
                  name === 'hours' ? 'Study Hours' : name === 'performance' ? 'Performance' : 'Sessions'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="hours"
              />
              <Line 
                type="monotone" 
                dataKey="performance" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                name="performance"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Progress Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-base lg:text-lg font-semibold text-slate-800 mb-4">Subject Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="subject" 
                stroke="#64748b" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [
                  `${value}${name === 'progress' ? '%' : ''}`,
                  name === 'progress' ? 'Progress' : name === 'weakAreas' ? 'Weak Areas' : 'Strong Areas'
                ]}
              />
              <Bar dataKey="progress" fill="#10b981" radius={[4, 4, 0, 0]} name="progress" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Subject Time Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-base lg:text-lg font-semibold text-slate-800 mb-4">Time Distribution by Subject</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}h`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}h`, 'Study Hours']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              <div className="text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No study sessions recorded yet</p>
                <p className="text-sm">Start studying to see your time distribution</p>
              </div>
            </div>
          )}
        </div>

        {/* Performance Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-base lg:text-lg font-semibold text-slate-800 mb-4">Performance Trend (Last 10 Sessions)</h3>
          {performanceTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="session" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name, props) => [
                    `${value}/10`,
                    `Performance (${props.payload.subject})`
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No performance data available</p>
                <p className="text-sm">Complete study sessions to track your performance</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-base lg:text-lg font-semibold text-slate-800 mb-4">Recent Study Sessions</h3>
        <div className="space-y-3">
          {loading ? ( // Conditional rendering for loading state
            Array.from({ length: 3 }).map((_, index) => ( // Show 3 skeleton items
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 rounded-lg space-y-2 sm:space-y-0 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full"></div> {/* Skeleton for icon/number */}
                  <div>
                    <div className="h-4 bg-slate-200 rounded w-32 mb-1"></div> {/* Skeleton for subject */}
                    <div className="h-3 bg-slate-200 rounded w-48"></div> {/* Skeleton for topics */}
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-slate-200 rounded w-16 mb-1"></div> {/* Skeleton for duration */}
                  <div className="h-3 bg-slate-200 rounded w-20"></div> {/* Skeleton for score */}
                </div>
              </div>
            ))
          ) : studySessions.length > 0 ? (
            studySessions.slice(0, 5).map((session, index) => (
              <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 rounded-lg space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{session.subject}</p>
                    <p className="text-xs lg:text-sm text-slate-600">
                      {session.topics_covered.length > 0 ? session.topics_covered.join(', ') : 'No topics specified'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-800">{session.duration_minutes}m</p>
                  <p className="text-xs lg:text-sm text-slate-600">Score: {session.performance_score}/10</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>No study sessions recorded yet</p>
              <p className="text-sm">Start studying to see your recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeAnalytics;