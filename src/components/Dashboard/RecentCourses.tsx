import React from 'react';
import { MoreHorizontal, ChevronRight, BookOpen, Award, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecentCoursesProps {
  progressReports: any[];
  studySessions: any[];
}

const RecentCourses: React.FC<RecentCoursesProps> = ({ progressReports, studySessions }) => {
  const navigate = useNavigate();
  
  // Get recently studied subjects
  const recentSubjects = studySessions
    .slice(0, 10)
    .reduce((acc, session) => {
      if (!acc.find(item => item.subject === session.subject)) {
        const subjectProgress = progressReports.find(r => r.subject === session.subject);
        const subjectSessions = studySessions.filter(s => s.subject === session.subject);
        const totalHours = Math.round(subjectSessions.reduce((sum, s) => sum + s.duration_minutes, 0) / 60 * 10) / 10;
        
        acc.push({
          subject: session.subject,
          progress: subjectProgress?.completion_percentage || 0,
          lastStudied: session.created_at,
          totalHours,
          sessions: subjectSessions.length,
          avgScore: Math.round(subjectSessions.reduce((sum, s) => sum + s.performance_score, 0) / subjectSessions.length * 10) / 10
        });
      }
      return acc;
    }, [] as any[])
    .slice(0, 3);

  const moduleColors = [
    { bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-50' },
    { bg: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-50' },
    { bg: 'bg-pink-500', text: 'text-pink-500', light: 'bg-pink-50' },
  ];

  const getSubjectIcon = (subject: string) => {
    const icons: Record<string, string> = {
      'Mathematics': '📐',
      'Physics': '⚛️',
      'Chemistry': '🧪',
      'Biology': '🧬',
      'English': '📚',
      'History': '📜',
      'Geography': '🌍',
      'Quantitative Aptitude': '📊',
      'Reasoning': '🧠',
      'General Knowledge': '💡'
    };
    return icons[subject] || '📖';
  };

  if (recentSubjects.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl max-[400px]:p-3 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Recent Courses</h3>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No courses started yet</p>
          <p className="text-slate-500 text-sm">Begin studying to see your recent courses</p>
          <button
            onClick={() => navigate('/app/courses')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6 max-[400px]:p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Recent Courses</h3>
          <p className="text-slate-600 text-sm mt-1">Your recently studied subjects</p>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="space-y-4">
        {recentSubjects.map((course, index) => {
          const colorScheme = moduleColors[index % moduleColors.length];
          
          return (
            <div
              key={course.subject}
              onClick={() => navigate(`/app/courses/${encodeURIComponent(course.subject)}`)}
              className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group max-[400px]:p-2"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 ${colorScheme.bg} rounded-xl flex items-center justify-center text-white text-lg`}>
                  {getSubjectIcon(course.subject)}
                </div>
                <div>
                  <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {course.subject}
                  </div>
                  <div className="text-xs text-slate-500">
                    {course.sessions} sessions • {course.totalHours}h studied
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-800">Progress</div>
                  <div className="text-lg font-bold text-slate-800">{course.progress}%</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/app/courses')}
          className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
        >
          View All Courses
        </button>
      </div>
    </div>
  );
};

export default RecentCourses;