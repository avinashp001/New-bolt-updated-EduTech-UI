import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Award, 
  Flame, 
  CheckCircle,
  AlertCircle,
  Play,
  ChevronRight,
  MoreHorizontal,
  Bell,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Users,
  Star,
  Zap,
  Brain,
  Timer,
  BarChart3,
  User,
  Rocket,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { useDetailedSchedule } from '../../hooks/useDetailedSchedule';
import { useStudyPlan } from '../../hooks/useStudyPlan';
import CalendarTracker from './CalendarTracker';
import StreakTracker from './StreakTracker';
import UpcomingSessions from './UpcomingSessions';
import StudyTimeHeatmap from './StudyTimeHeatmap';
import SkillRadarChart from './SkillRadarChart';
import RecentCourses from './RecentCourses';
import LearningOverview from './LearningOverview';
import PerformanceRing from './PerformanceRing';
import QuickActions from './QuickActions';
import Header from './Header';
import QuickStartGuide from '../Common/QuickStartGuide';

const EnhancedDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { detailedSchedule, loading: detailedScheduleLoading } = useDetailedSchedule(user?.id);
  const { studyPlan, loading: studyPlanLoading } = useStudyPlan(user?.id);
  // const { studyPlan } = useStudyPlan(user?.id);
  const { 
    studySessions, 
    progressReports, 
    getOverallProgress, 
    getWeeklyStudyHours,
    getTotalStudyHours,
    getAveragePerformance,
    loading 
  } = useProgress(user?.id, detailedSchedule, detailedScheduleLoading);

  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [showQuickStart, setShowQuickStart] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm animate-pulse">
                <div className="h-32 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const overallProgress = getOverallProgress();
  const weeklyHours = getWeeklyStudyHours();
  const totalHours = getTotalStudyHours();
  const avgPerformance = getAveragePerformance();

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

  // Calculate tasks completed (study sessions)
  const tasksCompleted = studySessions.length;
  const pointsEarned = Math.round(studySessions.reduce((sum, session) => 
    sum + (session.performance_score * session.duration_minutes / 10), 0));

  // Get today's sessions
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = studySessions.filter(session => 
    session.created_at.split('T')[0] === today
  );

  // Calculate pending study subjects
  const pendingStudySubjects = progressReports.filter(r => r.completion_percentage < 50).length;
  const totalCourses = progressReports.length || (studyPlan?.subjects.length || 0);
  const completedCourses = progressReports.filter(r => r.completion_percentage >= 80).length;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <QuickStartGuide isOpen={showQuickStart} onClose={handleCloseQuickStart} />
      
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Study Plan Generation Prompt */}
        {!studyPlanLoading && !studyPlan && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl border border-blue-500">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-8 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Generate Your Study Plan</h2>
                <p className="text-blue-100 text-lg">
                  Welcome! Let's create your personalized AI-powered study plan to maximize your exam preparation.
                </p>
              </div>
            </div>
            
            <div className="max-hidden grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <Brain className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">AI-Powered</h3>
                <p className="text-blue-100 text-sm">Intelligent scheduling based on your preferences and exam requirements</p>
              </div> */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <Target className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Personalized</h3>
                <p className="text-blue-100 text-sm">Tailored to your learning style, weak areas, and daily availability</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <TrendingUp className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Adaptive</h3>
                <p className="text-blue-100 text-sm">Continuously optimizes based on your progress and performance</p>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => navigate('/app/enhanced-schedule')}
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-3 mx-auto"
              >
                <Rocket className="w-6 h-6" />
                <span>Generate My Study Plan</span>
                <ArrowRight className="w-6 h-6" />
              </button>
              <p className="text-blue-200 text-sm mt-4">
                This will use your saved preferences to create an optimal study schedule
              </p>
            </div>
          </div>
        )}
        {/* Enhanced Header */}
        <Header 
          userName={user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student'} 
          avgActivity={Math.round(overallProgress)}
          studySessions={studySessions}
          selectedTimeRange={selectedTimeRange}
        />
        
        {/* Welcome Section */}
        {/* <div className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex space-x-4">
              <div className="w-16 h-10 mt-3 bg-gradient-to-r from-sky-800 to-emerald-900 rounded-xl flex items-center justify-center">
                <User className="w-7 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Welcome back, {user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student'}!
                </h1>
                <p className="text-slate-800 dark:text-slate-600">
                  Ready to continue your learning journey? 🚀
                </p>
                {studySessions.length === 0 && (
                  <div className="mt-2">
                    <button
                      onClick={() => setShowQuickStart(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Show quick start guide →
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
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
          </div>

        </div> */}

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Overview - Large Card */}
          <div className="lg:col-span-2">
            <LearningOverview 
              studySessions={studySessions}
              tasksCompleted={tasksCompleted}
              pointsEarned={pointsEarned}
              selectedTimeRange={selectedTimeRange}
              setSelectedTimeRange={setSelectedTimeRange}
            />
          </div>

          {/* Performance Ring */}
          <div className="lg:col-span-1">
            <PerformanceRing 
              overallProgress={overallProgress}
              avgPerformance={avgPerformance}
              studySessions={studySessions}
            />
          </div>
        </div>

        {/* Secondary Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skill Development Radar */}
          <div className="lg:col-span-1">
            <SkillRadarChart progressReports={progressReports} />
          </div>

          {/* Study Time Heatmap */}
          <div className="lg:col-span-1">
            <StudyTimeHeatmap studySessions={studySessions} />
          </div>

          {/* Recent Courses */}
          <div className="lg:col-span-1">
            <RecentCourses 
              progressReports={progressReports}
              studySessions={studySessions}
            />
          </div>
        </div>

        {/* Bottom Grid - Calendar, Streak, Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Tracker */}
          <div className="lg:col-span-1">
            <CalendarTracker studySessions={studySessions} />
          </div>

          {/* Streak Counter */}
          <div className="lg:col-span-1">
            <StreakTracker 
              currentStreak={currentStreak}
              studySessions={studySessions}
            />
          </div>

          {/* Upcoming Sessions */}
          <div className="lg:col-span-1">
            <UpcomingSessions 
              detailedSchedule={detailedSchedule}
              studyPlan={studyPlan}
              progressReports={progressReports}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions 
          totalCourses={totalCourses}
          completedCourses={completedCourses}
          pendingStudy={pendingStudySubjects}
          weeklyHours={weeklyHours}
          navigate={navigate}
        />
      </div>
    </div>
  );
};

export default EnhancedDashboard;