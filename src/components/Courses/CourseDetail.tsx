import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  CheckCircle, 
  Clock, 
  Trophy, 
  Flame, 
  BookOpen, 
  Brain,
  Play,
  Award,
  TrendingUp,
  AlertCircle,
  Zap,
  Star,
  Crown,
  Sparkles,
  ChevronRight,
  BarChart3,
  Users,
  Timer,
  Rocket,
  Eye,
  ArrowRight,
  Loader
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { useStudyPlan } from '../../hooks/useStudyPlan';
import { useDetailedSchedule } from '../../hooks/useDetailedSchedule';

interface DailyMilestone {
  id: string;
  day: number;
  date: string;
  topic: string;
  // description: string;
  estimatedHours: number;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  score?: number;
  completedAt?: string;
  // subtopics: string[];
  learningObjectives: string[];
}

const CourseDetail: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subject } = useParams<{ subject: string }>();
  const { studyPlan } = useStudyPlan(user?.id);
  const { detailedSchedule, loading: detailedScheduleLoading } = useDetailedSchedule(user?.id);
  const { progressReports, studySessions } = useProgress(user?.id, detailedSchedule, detailedScheduleLoading);
  
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [milestones, setMilestones] = useState<DailyMilestone[]>([]);
  const [hoveredMilestone, setHoveredMilestone] = useState<string | null>(null);
  const [animatedStats, setAnimatedStats] = useState({
    completionPercentage: 0,
    completedMilestones: 0,
    totalHours: 0,
    avgPerformance: 0,
    streak: 0
  });

  useEffect(() => {
    const generateMilestones = () => {
      let generatedMilestones: DailyMilestone[] = [];

      if (!detailedScheduleLoading && detailedSchedule && detailedSchedule.daily_schedule) {
        const dailyScheduleArray = Array.isArray(detailedSchedule.daily_schedule)
          ? detailedSchedule.daily_schedule
          : [];

        const subjectSchedules = dailyScheduleArray.filter((daySchedule: any) =>
          daySchedule.subjects && Array.isArray(daySchedule.subjects) && daySchedule.subjects.some((subj: any) =>
            subj.subject === (subject ? decodeURIComponent(subject) : '')
          )
        );

        if (subjectSchedules.length > 0) {
          const decodedSubject = subject ? decodeURIComponent(subject) : '';
          subjectSchedules.forEach((daySchedule: any, index: number) => {
            const subjectData = daySchedule.subjects.find((subj: any) => subj.subject === decodedSubject);
            if (subjectData && subjectData.topics && Array.isArray(subjectData.topics)) {
              subjectData.topics.forEach((topic: string, topicIndex: number) => {
                const milestoneId = `${decodedSubject}-${index}-${topicIndex}`;
                const milestoneDate = new Date(daySchedule.date || new Date());

                const topicSessions = studySessions.filter(session =>
                  session.subject === decodedSubject &&
                  session.topics_covered.some(t =>
                    t.toLowerCase().includes(topic.toLowerCase().split(' ')[0]) ||
                    topic.toLowerCase().includes(t.toLowerCase())
                  )
                );

                const isCompleted = topicSessions.length > 0;
                const avgScore = isCompleted
                  ? Math.round(topicSessions.reduce((sum, s) => sum + s.performance_score, 0) / topicSessions.length)
                  : undefined;

                generatedMilestones.push({
                  id: milestoneId,
                  day: index + 1,
                  date: milestoneDate.toISOString().split('T')[0],
                  topic: topic.replace(`${decodedSubject} - `, ''),
                  estimatedHours: subjectData.hours || 2,
                  difficulty: index < subjectSchedules.length * 0.3 ? 'easy' :
                             index < subjectSchedules.length * 0.7 ? 'medium' : 'hard',
                  completed: isCompleted,
                  score: avgScore,
                  completedAt: isCompleted ? topicSessions[0]?.created_at : undefined,
                  // subtopics: [
                  //   `${topic} - Theory`,
                  //   `${topic} - Examples`,
                  //   `${topic} - Practice Problems`,
                  //   `${topic} - Applications`
                  // ],
                  learningObjectives: [
                    `Understand core concepts of ${topic}`,
                    // `Apply ${topic} principles to solve problems`,
                    // `Analyze real-world applications of ${topic}`,
                    // `Evaluate different approaches in ${topic}`
                  ]
                });
              });
            }
          });
        }
      }

      if (generatedMilestones.length === 0) {
        const fallbackTopics = [
          'Basic Concepts',
          'Intermediate Topics',
          'Advanced Applications',
          'Problem Solving',
          'Practice Tests'
        ];
        
        fallbackTopics.forEach((topic, index) => {
          generatedMilestones.push({
            id: `fallback-${index}`,
            day: index + 1,
            date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            topic,
            // description: `Master ${topic} with comprehensive understanding`,
            estimatedHours: 2,
            difficulty: index < 2 ? 'easy' : index < 4 ? 'medium' : 'hard',
            completed: false,
            // subtopics: [`${topic} - Theory`, `${topic} - Practice`],
            learningObjectives: [`Understand ${topic}`, `Apply ${topic} concepts`]
          });
        });
      }

      setMilestones(generatedMilestones);
    };

    if (subject) {
      generateMilestones();
    }
  }, [subject, studySessions, detailedSchedule, detailedScheduleLoading]);

  // Animate stats on mount
  useEffect(() => {
    if (!subject) return;
    
    const decodedSubject = decodeURIComponent(subject);
    const subjectSessions = studySessions.filter(session => session.subject === decodedSubject);
    const subjectProgress = progressReports.find(report => report.subject === decodedSubject);
    
    const totalHours = Math.round((subjectSessions.reduce((sum, session) => sum + session.duration_minutes, 0) / 60) * 10) / 10;
    const avgPerformance = subjectSessions.length > 0 
      ? Math.round((subjectSessions.reduce((sum, session) => sum + session.performance_score, 0) / subjectSessions.length) * 10) / 10
      : 0;
    const completionPercentage = subjectProgress?.completion_percentage || 0;
    
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasStudiedOnDate = subjectSessions.some(session => 
        session.created_at.split('T')[0] === dateStr
      );
      
      if (hasStudiedOnDate) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    const completedMilestones = milestones.filter(m => m.completed).length;

    // Animate stats
    setTimeout(() => {
      const animateValue = (start: number, end: number, setter: (value: number) => void, duration: number = 1000) => {
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const current = Math.round(start + (end - start) * easeOutQuart);
          setter(current);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      };

      animateValue(0, completionPercentage, (val) => 
        setAnimatedStats(prev => ({ ...prev, completionPercentage: val })), 1000);
      animateValue(0, completedMilestones, (val) => 
        setAnimatedStats(prev => ({ ...prev, completedMilestones: val })), 1200);
      animateValue(0, totalHours, (val) => 
        setAnimatedStats(prev => ({ ...prev, totalHours: val })), 1400);
      animateValue(0, avgPerformance, (val) => 
        setAnimatedStats(prev => ({ ...prev, avgPerformance: val })), 1600);
      animateValue(0, streak, (val) => 
        setAnimatedStats(prev => ({ ...prev, streak: val })), 1800);
    }, 500);
  }, [subject, studySessions, progressReports, milestones]);

  if (!subject) {
    navigate('/app/courses');
    return null;
  }

  const decodedSubject = decodeURIComponent(subject);

  const subjectIcons: Record<string, string> = {
    'Mathematics': '📐',
    'Physics': '⚛️',
    'Chemistry': '🧪',
    'Biology': '🧬',
    'History': '📜',
    'Geography': '🌍',
    'Economics': '📊',
    'Political Science': '🏛️',
    'English': '📚',
    'Current Affairs': '📰',
    'Reasoning': '🧠',
    'General Knowledge': '💡',
    'Quantitative Aptitude': '📊',
    'General Awareness': '💡',
    'General Intelligence & Reasoning': '🧠'
  };

  if (detailedScheduleLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600"></div>
              <Loader className="w-10 h-10 text-blue-600 absolute top-5 left-5" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Loading Your Learning Path...</h3>
            <p className="text-slate-600 text-center max-w-md">
              Fetching your personalized daily schedule and learning milestones for {decodedSubject}
            </p>
            <div className="mt-6 flex items-center space-x-4 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Personalized Content</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Personalized Milestones</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const milestonesPerWeek = 7;
  const weekMilestones = milestones.slice(
    (selectedWeek - 1) * milestonesPerWeek,
    selectedWeek * milestonesPerWeek
  );

  const totalWeeks = Math.ceil(milestones.length / milestonesPerWeek);
  const completedMilestones = milestones.filter(m => m.completed).length;
  const overallCompletion = milestones.length > 0
    ? Math.round((completedMilestones / milestones.length) * 100)
    : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-3">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 rounded-3xl text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative z-10">
          <div className="flex items-start mb-5 max-[450px]:flex-col">
            <button
              onClick={() => navigate('/app/courses')}
              className="p-2 hover:bg-white/10 rounded-2xl transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-xl">
              {subjectIcons[decodedSubject] || '📖'}
            </div>
            <div style={{marginLeft: '0.7rem !important'}}>
              <h2 className="text-2xl font-bold mb-1">{decodedSubject}</h2>
              <p className="text-indigo-100 text-sm">Daily milestones & intelligent progress tracking</p>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Brain className="w-3 h-3" />
                  <span>Smart Learning</span>
                </div>
                <div className="flex items-center text-sm space-x-2">
                  <Target className="w-3 h-3" />
                  <span>Personalized Milestones</span>
                </div>
              </div>
            </div>
          </div>

          {/* Animated Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl pl-4 pr-4 pt-4 pb-4 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-xl font-bold mb-2 bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                {animatedStats.completionPercentage}%
              </div>
              <div className="text-indigo-100 text-xs font-medium">Complete</div>
              <div className="mt-1 w-full bg-white/20 rounded-full h-1">
                <div 
                  className="bg-white h-1 text-sm rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${animatedStats.completionPercentage}%` }}
                />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl pt-4 pr-4 pl-4 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-xl font-bold mb-1 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                {animatedStats.completedMilestones}
              </div>
              <div className="flex flex-center justify-center text-indigo-100 text-xs font-medium"
              style={{alignItems:"center"}}><Trophy className="w-3 h-3 mx-2 text-xs text-yellow-300"/>Milestones</div>
            </div>
            
            {/* <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                {animatedStats.totalHours}h
              </div>
              <div className="text-indigo-100 text-xs font-medium">Study Time</div>
              <div className="mt-2 flex items-center justify-center">
                <Clock className="w-4 h-4 text-xs text-purple-300" />
              </div>
            </div> */}
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl pt-4 pr-4 pl-4 pb-0 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {animatedStats.avgPerformance}/10
              </div>
              <div className="flex justify-center text-indigo-100 text-xs font-medium"
              style={{alignItems:"center"}}><Award className="w-3 h-3 mx-2 text-xs text-blue-300"/>Avg Score</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Flame className="w-4 h-4 text-orange-300 animate-pulse" />
                <div className="text-xl font-bold bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                  {animatedStats.streak}
                </div>
              </div>
              <div className="text-orange-200 text-xs font-medium">{animatedStats.streak >= 7 ? 'On Fire! 🔥' : 'Keep Going! 💪'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Week Navigation */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-8 py-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Weekly Milestones</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
                disabled={selectedWeek === 1}
                className="p-3 rounded-xl border-2 border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="w-5 h-5 min-[350px]:w-3 min-[350px]:h-3 rotate-180" />
              </button>
              <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-bold shadow-lg">
                Week {selectedWeek} of {totalWeeks}
              </div>
              <button
                onClick={() => setSelectedWeek(Math.min(totalWeeks, selectedWeek + 1))}
                disabled={selectedWeek === totalWeeks}
                className="p-3 rounded-xl border-2 border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="w-5 h-5 min-[350px]:w-3 min-[350px]:h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 min-[350px]:p-4 space-y-8">
          {/* Week Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg min-[350px]:text-sm font-bold text-slate-700">Week {selectedWeek} Progress</span>
              <span className="text-lg font-bold text-slate-800">
                {Math.round((weekMilestones.filter(m => m.completed).length / weekMilestones.length) * 100)}%
              </span>
            </div>
            <div className="relative">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-4 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${(weekMilestones.filter(m => m.completed).length / weekMilestones.length) * 100}%` 
                  }}
                />
              </div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center">
                <Sparkles className="w-4 h-4 text-white animate-ping" style={{ 
                  left: `${(weekMilestones.filter(m => m.completed).length / weekMilestones.length) * 100}%`,
                  transform: 'translateX(-50%)'
                }} />
              </div>
            </div>
          </div>

          {/* Enhanced Milestones Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12">
            {weekMilestones.map((milestone, index) => (
              <div
                key={milestone.id}
                onMouseEnter={() => setHoveredMilestone(milestone.id)}
                onMouseLeave={() => setHoveredMilestone(null)}
                className={`relative p-8 rounded-3xl border-2 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                  milestone.completed
                    ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-xl'
                } ${hoveredMilestone === milestone.id ? 'scale-30' : ''}`}
              >
                {/* Day Badge */}
                <div className="absolute -top-3 -left-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg">
                  {milestone.day}
                </div>

                {/* Completion Status */}
                <div className="absolute -top-3 -right-1">
                  {milestone.completed ? (
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-300 to-gray-400 text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <Clock className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors"
                    style={{fontSize: "1rem"}}>
                      {milestone.topic}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full font-bold border ${getDifficultyColor(milestone.difficulty)}`}
                      style={{fontSize: "0.65rem"}}>
                        {getDifficultyIcon(milestone.difficulty)} {milestone.difficulty.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* <p className="text-slate-600 text-sm mb-6 leading-relaxed">{milestone.description}</p> */}

                  {/* Learning Objectives */}
                  {/* <div className="mb-6">
                    <h5 className="text-sm font-bold text-slate-700 mt-2 mb-1 flex items-center space-x-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span>Learning Objectives</span>
                    </h5>
                    <div className="space-y-2">
                      {milestone.learningObjectives.slice(0, 2).map((objective, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs text-slate-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span className="leading-relaxed">{objective}</span>
                        </div>
                      ))}
                    </div>
                  </div> */}

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">{milestone.estimatedHours}h</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs">{new Date(milestone.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {milestone.completed && milestone.score && (
                      <div className="flex items-center space-x-1 text-sm font-bold text-green-600">
                        <Award className="w-4 h-4" />
                        <span>{milestone.score}/10</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {milestone.completed ? (
                      <div className="space-y-3">
                        <button
                          onClick={() => navigate(`/app/courses/${encodeURIComponent(decodedSubject)}/theory/${encodeURIComponent(milestone.topic)}`)}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                        >
                          <Eye className="w-3 h-3" />
                          <span className='text-sm'>Review Content</span>
                        </button>
                        <button
                          onClick={() => navigate(`/app/courses/${encodeURIComponent(decodedSubject)}/theory-quiz/${encodeURIComponent(milestone.topic)}`, { 
                            state: { initialSubject: decodedSubject, initialTopic: milestone.topic }
                          })}
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                        >
                          <BarChart3 className="w-3 h-3" />
                          <span className='text-sm'>Re-evaluate</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <button
                          onClick={() => navigate(`/app/courses/${encodeURIComponent(decodedSubject)}/theory/${encodeURIComponent(milestone.topic)}`)}
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                        >
                          <Play className="w-3 h-3" /><span className='text-sm'>Start Learning</span>
                        </button>
                        <button
                          onClick={() => navigate('/app/weekly-tracker', { 
                            state: { initialSubject: decodedSubject, initialTopic: milestone.topic }
                          })}
                          className="w-full border-2 border-blue-500 text-blue-600 px-5 py-2 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2"
                        >
                          <Zap className="w-3 h-3" />
                          <span className='text-sm'>Quick Assessment</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl transition-opacity duration-300 ${
                  hoveredMilestone === milestone.id ? 'opacity-100' : 'opacity-0'
                }`} 
                  style={{ zIndex: -90 }}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Achievement Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Achievements & Milestones</h3>
            <p className="text-slate-300">Celebrate your learning journey and track your success</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold mb-2">{completedMilestones}</div>
            <div className="text-slate-300 text-sm font-medium">Milestones Achieved</div>
            <div className="mt-2 text-xs text-yellow-400">
              {completedMilestones >= 10 ? 'Master Achiever! 👑' : 'Keep Going! 🚀'}
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold mb-2">{animatedStats.streak}</div>
            <div className="text-slate-300 text-sm font-medium">Current Streak</div>
            <div className="mt-2 text-xs text-orange-400">
              {animatedStats.streak >= 7 ? 'Unstoppable! 🔥' : 'Building Momentum! ⚡'}
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold mb-2">{animatedStats.avgPerformance}/10</div>
            <div className="text-slate-300 text-sm font-medium">Average Score</div>
            <div className="mt-2 text-xs text-green-400">
              {animatedStats.avgPerformance >= 8 ? 'Excellence! ⭐' : 'Improving! 📈'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;