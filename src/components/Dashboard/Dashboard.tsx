import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Activity, Target, TrendingUp, BookOpen, Award } from 'lucide-react';
import Header from './Header';
import AnalyticsCard from './AnalyticsCard';
import ProgressChart from './ProgressChart';
import SubjectOverview from './SubjectOverview';
import ActivityRing from './ActivityRing';
import SuccessTracker from './SuccessTracker';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import {useDetailedSchedule} from '../../hooks/useDetailedSchedule';


const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { detailedSchedule, loading: detailedScheduleLoading } = useDetailedSchedule(user?.id);
  const { 
    studySessions, 
    progressReports, 
    getOverallProgress, 
    getWeeklyStudyHours,
    getTotalStudyHours,
    getAveragePerformance,
    loading 
  } = useProgress(user?.id, detailedSchedule, detailedScheduleLoading);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm animate-pulse">
              <div className="h-16 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const overallProgress = getOverallProgress();
  const weeklyHours = getWeeklyStudyHours();
  const totalHours = getTotalStudyHours();
  const avgPerformance = getAveragePerformance();

  // Calculate weekly change
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const lastWeekSessions = studySessions.filter(session => {
    const sessionDate = new Date(session.created_at);
    return sessionDate >= lastWeek && sessionDate < thisWeek;
  });
  
  const lastWeekHours = lastWeekSessions.reduce((total, session) => 
    total + session.duration_minutes, 0) / 60;
  
  const weeklyChange = weeklyHours - lastWeekHours;

  return (
    <div className="space-y-6">
      <Header 
        userName={user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student'} 
        avgActivity={Math.round(overallProgress)}
        studySessions={studySessions}
      />
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <AnalyticsCard
          title="Weekly Hours"
          value={`${weeklyHours}h`}
          change={`${weeklyChange >= 0 ? '+' : ''}${weeklyChange.toFixed(1)}h`}
          changeType={weeklyChange >= 0 ? "positive" : "negative"}
          icon={<Clock className="w-5 h-5" />}
          color="orange"
        />
        <AnalyticsCard
          title="Overall Progress"
          value={`${overallProgress}%`}
          change={`${progressReports.length} subjects`}
          changeType="positive"
          icon={<Activity className="w-5 h-5" />}
          color="green"
        />
        <AnalyticsCard
          title="Avg Performance"
          value={`${avgPerformance}/10`}
          change={`${studySessions.length} sessions`}
          changeType={avgPerformance >= 7 ? "positive" : "negative"}
          icon={<Award className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Charts and Progress */}
      <div className="grid grid-cols-1 gap-6">
        <div className="lg:col-span-2">
          <ProgressChart studySessions={studySessions} />
        </div>
      </div>

      {/* Subject Overview and Activity Ring */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SubjectOverview progressReports={progressReports} studySessions={studySessions} />
        </div>
        <div className="space-y-6">
          <ActivityRing studySessions={studySessions} />
          <SuccessTracker progressReports={progressReports} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;