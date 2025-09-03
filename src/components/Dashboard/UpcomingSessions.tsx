import React from 'react';
import { MoreHorizontal, Play, Clock, BookOpen, Target, Calendar, AlertCircle, Globe, History, HandCoins, Landmark, DraftingCompass, Brain, Atom, Dna, FlaskConical, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpcomingSessionsProps {
  detailedSchedule: any;
  studyPlan: any;
  progressReports: any[];
}

const UpcomingSessions: React.FC<UpcomingSessionsProps> = ({ 
  detailedSchedule, 
  studyPlan, 
  progressReports 
}) => {
  const navigate = useNavigate();

  // Generate upcoming sessions from detailed schedule
  const getUpcomingSessions = () => {
    const sessions = [];
    const today = new Date();
    
    if (detailedSchedule?.daily_schedule) {
      const dailyScheduleArray = Array.isArray(detailedSchedule.daily_schedule)
        ? detailedSchedule.daily_schedule
        : [];

      // Get next 5 days of sessions
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const daySchedule = dailyScheduleArray.find((day: any) => 
          day.date === dateStr
        );
        
        if (daySchedule?.subjects) {
          daySchedule.subjects.slice(0, 5).forEach((subject: any, index: number) => {
            if (sessions.length < 6) { // Limit to 6 sessions
              const subjectProgress = progressReports.find(r => r.subject === subject.subject);
              const isCompleted = (subjectProgress?.completion_percentage || 0) >= 80;
              
              sessions.push({
                id: `${dateStr}-${index}`,
                subject: subject.subject,
                topic: subject.topics?.[0]?.replace(`${subject.subject} - `, '') || 'General Study',
                timeSlot: subject.timeSlot || `${8 + index * 2}:00 AM`,
                duration: `${subject.hours || 2}h`,
                date: date,
                dateStr,
                isToday: i === 0,
                isTomorrow: i === 1,
                priority: subject.priority || 'medium',
                studyType: subject.studyType || 'study',
                isCompleted,
                progress: subjectProgress?.completion_percentage || 0
              });
            }
          });
        }
      }
    }
    
    // Fallback sessions if no detailed schedule
    if (sessions.length === 0 && studyPlan?.subjects) {
      studyPlan.subjects.slice(0, 4).forEach((subject: string, index: number) => {
        const subjectProgress = progressReports.find(r => r.subject === subject);
        const isCompleted = (subjectProgress?.completion_percentage || 0) >= 80;
        
        sessions.push({
          id: `fallback-${index}`,
          subject,
          topic: 'Scheduled Study',
          timeSlot: `${9 + index}:00 AM`,
          duration: '2h',
          date: new Date(today.getTime() + index * 24 * 60 * 60 * 1000),
          dateStr: new Date(today.getTime() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isToday: index === 0,
          isTomorrow: index === 1,
          priority: 'medium',
          studyType: 'study',
          isCompleted,
          progress: subjectProgress?.completion_percentage || 0
        });
      });
    }
    
    return sessions;
  };

  const upcomingSessions = getUpcomingSessions();

  const getSubjectIcon = (subject: string) => {
  const Icon = icons[subject] || BookOpen; // fallback
  return <Icon className="w-6 h-6 font-semibold text-white" />; 
};
  
  const icons: Record<string, React.ElementType> = {
  Mathematics: DraftingCompass,
  Physics: Atom,
  Chemistry: FlaskConical,
  Biology: Dna,
  English: BookOpen,
  'Quantitative Aptitude': DraftingCompass,
    'General Intelligence & Reasoning': Brain,
  Reasoning: Brain,
  'General Knowledge': Lightbulb,
  History: History,
    Geography: Globe,
    Polity: Landmark,
    Economics: HandCoins,
};

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusColor = (session: any) => {
    if (session.isCompleted) return 'border-green-200 bg-green-50';
    if (session.isToday) return 'border-blue-200 bg-blue-50';
    if (session.priority === 'high') return 'border-orange-200 bg-orange-50';
    return 'border-slate-200 bg-slate-50';
  };

  if (upcomingSessions.length === 0) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold dark:text-white/80 text-slate-800">Upcoming Sessions</h3>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-white/50 font-medium">No upcoming sessions</p>
          <p className="text-slate-500 dark:text-white/50 text-sm">Create a study plan to see scheduled sessions</p>
          <button
            onClick={() => navigate('/app/enhanced-schedule')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Schedule
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">Upcoming Sessions</h3>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="space-y-3"
      style={{
        height: '60vh',
    overflowX: 'auto',
    scrollbarWidth: 'none'
      }}>
        {upcomingSessions.map((session, index) => (
          <div
            key={session.id}
            className={`p-4 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer ${getStatusColor(session)}`}
            onClick={() => navigate(`/app/courses/${encodeURIComponent(session.subject)}`)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${getPriorityColor(session.priority)} rounded-xl flex items-center justify-center text-white text-lg`}>
                  {getSubjectIcon(session.subject)}
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-sm">
                    {session.subject.length > 15 ? session.subject.substring(0, 15) + '...' : session.subject}
                  </div>
                  <div className="text-xs text-slate-600">
                    {session.topic.length > 20 ? session.topic.substring(0, 20) + '...' : session.topic}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-500"
                      style={{fontSize:"0.66rem"}}>{session.timeSlot}</span>
                    <span className="text-xs text-slate-500"
                      style={{fontSize:"0.66rem"}}>• {session.duration}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                {session.isCompleted ? (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <button className="w-12 h-8 font-semibold text-xs bg-green-400 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <span className="w-6 h-4 text-white ml-0.5" 
                      onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/app/courses/${encodeURIComponent(session.subject)}/theory/${encodeURIComponent(session.topic)}`);
                  }}>Join</span>
                  </button>
                )}
              </div>
            </div>

            {/* Progress bar for incomplete sessions */}
            {!session.isCompleted && session.progress > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">Progress</span>
                  <span className="text-xs font-medium text-slate-700">{session.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${session.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Session tags */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                {session.isToday && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Today
                  </span>
                )}
                {session.isTomorrow && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    Tomorrow
                  </span>
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  session.priority === 'high' ? 'bg-red-100 text-red-700' :
                  session.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {session.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/app/enhanced-schedule')}
          className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
        >
          View Full Schedule
        </button>
      </div>
    </div>
  );
};

export default UpcomingSessions;