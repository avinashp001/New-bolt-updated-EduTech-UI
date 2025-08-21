import React from 'react';
import { BookOpen, TrendingUp, Clock } from 'lucide-react';

interface SubjectOverviewProps {
  progressReports: any[];
  studySessions: any[];
}

const SubjectOverview: React.FC<SubjectOverviewProps> = ({ progressReports, studySessions }) => {
  // Calculate subject statistics
  const subjectStats = progressReports.map(report => {
    const subjectSessions = studySessions.filter(session => session.subject === report.subject);
    const totalMinutes = subjectSessions.reduce((sum, session) => sum + session.duration_minutes, 0);
    const avgPerformance = subjectSessions.length > 0 
      ? subjectSessions.reduce((sum, session) => sum + session.performance_score, 0) / subjectSessions.length 
      : 0;
    
    return {
      subject: report.subject,
      progress: report.completion_percentage || 0,
      totalHours: Math.round((totalMinutes / 60) * 100) / 100,
      sessions: subjectSessions.length,
      avgPerformance: Math.round(avgPerformance * 100) / 100,
      weakAreas: report.weak_areas?.length || 0,
      strongAreas: report.strong_areas?.length || 0,
    };
  });

  // Add subjects that have sessions but no progress reports
  const sessionSubjects = [...new Set(studySessions.map(s => s.subject))];
  sessionSubjects.forEach(subject => {
    if (!subjectStats.find(s => s.subject === subject)) {
      const subjectSessions = studySessions.filter(session => session.subject === subject);
      const totalMinutes = subjectSessions.reduce((sum, session) => sum + session.duration_minutes, 0);
      const avgPerformance = subjectSessions.length > 0 
        ? subjectSessions.reduce((sum, session) => sum + session.performance_score, 0) / subjectSessions.length 
        : 0;
      
      subjectStats.push({
        subject,
        progress: 0,
        totalHours: Math.round((totalMinutes / 60) * 100) / 100,
        sessions: subjectSessions.length,
        avgPerformance: Math.round(avgPerformance * 100) / 100,
        weakAreas: 0,
        strongAreas: 0,
      });
    }
  });

  // Sort by total hours studied (most studied first)
  subjectStats.sort((a, b) => b.totalHours - a.totalHours);

  const totalSessions = studySessions.length;
  const totalHours = subjectStats.reduce((sum, stat) => sum + stat.totalHours, 0);
  const avgProgress = subjectStats.length > 0 
    ? Math.round(subjectStats.reduce((sum, stat) => sum + stat.progress, 0) / subjectStats.length)
    : 0;

  if (subjectStats.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Subject Overview</h3>
        <div className="text-center py-8">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No subjects studied yet</p>
          <p className="text-slate-500 text-sm">Start a study session to see your subject progress</p>
        </div>
      </div>
    );
  }

  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-orange-100 text-orange-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800',
  ];

  return (
    <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-slate-800">Subject Overview</h3>
        <div className="hidden lg:flex items-center space-x-4 text-sm text-slate-600">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>{subjectStats.length} Active Subjects</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{avgProgress}% Avg Progress</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {subjectStats.slice(0, 6).map((stat, index) => (
          <div key={stat.subject} className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 lg:p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
            <div className="text-lg font-bold text-slate-400 w-8 hidden sm:block">
              {String(index + 1).padStart(2, '0')}
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              <div className="sm:hidden text-sm font-bold text-slate-400">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <BookOpen className="w-5 h-5 text-slate-600" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-medium text-slate-800 text-sm lg:text-base">{stat.subject}</span>
                <p className="text-xs text-slate-500">{stat.sessions} sessions</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-6">
              <div className="text-center">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${colors[index % colors.length]}`}>
                  {stat.progress}%
                </div>
                <span className="text-xs text-slate-500 hidden sm:block">Progress</span>
              </div>
              
              <div className="text-center">
                <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {stat.totalHours}h
                </div>
                <span className="text-xs text-slate-500 hidden sm:block">Time</span>
              </div>
              
              <div className="text-center">
                <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  {stat.avgPerformance}/10
                </div>
                <span className="text-xs text-slate-500 hidden sm:block">Score</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {subjectStats.length > 6 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-500">
            Showing top 6 subjects • {subjectStats.length - 6} more subjects
          </p>
        </div>
      )}
    </div>
  );
};

export default SubjectOverview;