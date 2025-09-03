import React, {useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Search, Bell, Filter, Calendar, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QuickStartGuide from '../Common/QuickStartGuide';
import { useProgress } from '../../hooks/useProgress';

interface HeaderProps {
  userName: string;
  avgActivity: number;
  studySessions?: any[];
  selectedTimeRange?: string;
}

const Header: React.FC<HeaderProps> = ({ userName, avgActivity, studySessions = [], selectedTimeRange = 'week' }) => {
  // Calculate this week's activity vs last week
  const now = new Date();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showQuickStart, setShowQuickStart] = useState(false);
  const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const thisWeekSessions = studySessions.filter(session =>
    new Date(session.created_at) >= thisWeekStart
  );

  const lastWeekSessions = studySessions.filter(session => {
    const sessionDate = new Date(session.created_at);
    return sessionDate >= lastWeekStart && sessionDate < thisWeekStart;
  });

  const thisWeekMinutes = thisWeekSessions.reduce((sum, s) => sum + s.duration_minutes, 0);
  const lastWeekMinutes = lastWeekSessions.reduce((sum, s) => sum + s.duration_minutes, 0);

  const weeklyActivityChange = lastWeekMinutes > 0
    ? Math.round(((thisWeekMinutes - lastWeekMinutes) / lastWeekMinutes) * 100)
    : thisWeekMinutes > 0 ? 100 : 0;
  


  // Calculate streak
  const calculateStreak = () => {
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasStudiedOnDate = studySessions.some(session => 
        session.created_at.split('T')[0] === dateStr
      );
      
      if (hasStudiedOnDate) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Get today's sessions
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = studySessions.filter(session => 
    session.created_at.split('T')[0] === today
  );

    // Show quick start guide for new users
      useEffect(() => {
        const hasSeenGuide = localStorage.getItem('hasSeenQuickStartGuide');
        if (!hasSeenGuide && user && studySessions.length === 0) {
          setShowQuickStart(true);
        }
      }, [user, studySessions]);
    
      const handleCloseQuickStart = () => {
        setShowQuickStart(false);
        localStorage.setItem('hasSeenQuickStartGuide', 'true');
      };

  return (
    <div className="bg-white dark:bg-white p-8 lg:p-6 rounded-2xl shadow-sm mb-6 border border-slate-200 dark:border-slate-700">
      <QuickStartGuide isOpen={showQuickStart} onClose={handleCloseQuickStart} />
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4 min-w-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 flex items-center space-x-2">
              Welcome back, {userName}!
              {/* <span className="text-2xl">📈</span> */}
            </h1>
            <p className="text-xs mt-2 lg:text-sm text-slate-500 dark:text-slate-900">
              Your progress this {selectedTimeRange} is <span className="font-semibold text-blue-600">{avgActivity}%</span>
              {weeklyActivityChange !== 0 && (
                <span className={`ml-2 ${weeklyActivityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({weeklyActivityChange > 0 ? '+' : ''}{weeklyActivityChange}% vs last week)
                </span>
              )}
            </p>
            <p className="text-slate-900 font-semibold text-base mt-4 dark:text-slate-900">
                  
                  Ready to continue your learning journey?
                </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:space-y-0 lg:space-x-4">

          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-2 py-2 rounded-xl">
            <Calendar className="w-5 h-5 text-slate-600 dark:text-white" />
            <span className="text-sm font-medium text-slate-700 dark:text-white">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

           <div className="flex items-center mt-6 justify-center space-x-4">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
                  <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{todaySessions.length}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Today's Sessions</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
                  <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{currentStreak}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Day Streak</div>
                </div>
              </div>
              
            </div>


          {/* Action Buttons */}
          <div className="flex items-center mt-8 mb-2 space-x-2 flex-wrap">
            <button 
              onClick={() => navigate('/app/analytics')}
              className="bg-slate-900 dark:bg-emerald-800 text-white px-4 lg:px-6 py-2 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-500 transition-colors text-sm lg:text-base"
            >
              Analytics
            </button>
            <button 
              className="bg-slate-900 border dark:bg-emerald-800  text-slate-700 text-white px-4 lg:px-6 py-2 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm lg:text-base"
              onClick={() => navigate('/app/courses')}
            >
              Study now
            </button>
            <button 
              className="text-slate-600 ml-2 mt-2 dark:text-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-sm lg:text-base hidden sm:block"
              onClick={() => navigate('/app/enhanced-schedule')}
            >
              Schedule
            </button>
            <button 
              className="bg-slate-900 border border-slate-300 dark:bg-emerald-800 text-slate-700 text-white px-4 lg:px-6 py-2 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm lg:text-base"
              onClick={() => navigate('/app/ai-mentor')}
            >
              Mentor
            </button>
          </div>

             {/* Search and Notification */}
          <div className="flex items-center mt-2 space-x-2 lg:space-x-3">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Search className="w-5 h-5 text-slate-600" />
            </button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => navigate('/app/settings')}>
              <Filter className="w-5 h-5 text-slate-600" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Header;