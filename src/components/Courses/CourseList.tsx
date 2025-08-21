import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Trophy, 
  Calendar, 
  Target, 
  ChevronRight, 
  Flame, 
  Award, 
  Clock,
  Brain,
  Play,
  Star,
  TrendingUp,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BarChart3,
  Users,
  Crown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { useStudyPlan } from '../../hooks/useStudyPlan';
import { useDetailedSchedule } from '../../hooks/useDetailedSchedule';

const CourseList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { studyPlan } = useStudyPlan(user?.id);
  const { detailedSchedule, detailedScheduleLoading } = useDetailedSchedule(user?.id);
  const { progressReports, studySessions } = useProgress(user?.id, detailedSchedule, detailedScheduleLoading);
  
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [animatedStats, setAnimatedStats] = useState({
    totalSubjects: 0,
    completedSubjects: 0,
    totalStudyHours: 0,
    currentStreak: 0
  });

  const subjectIcons: Record<string, string> = {
    'Quantitative Aptitude': '📊',
    'General Awareness': '💡',
    'English Language': '📚',
    'General Intelligence & Reasoning': '🧠',
    'Mathematics': '📐',
    'Physics': '⚛️',
    'Chemistry': '🧪',
    'Biology': '🧬',
    'History': '📜',
    'Geography': '🌍',
    'Economics': '📊',
    'Political Science': '🏛️',
    'Current Affairs': '📰',
    'General Knowledge': '💡'
  };

    const availableSubjects = studyPlan?.subjects && studyPlan.subjects.length > 0 ? studyPlan.subjects : [];

  const fallbackTopics: Record<string, string[]> = {
    'Quantitative Aptitude': [
      'Percentage', 'Profit & Loss', 'Simple Interest', 'Compound Interest',
      'Ratio & Proportion', 'Time & Work', 'Pipes & Cisterns',
      'Time, Speed & Distance', 'Algebra (Linear, Quadratic)', 'Average',
      'Mixture & Alligation', 'Number System', 'Mensuration', 'Permutation & Combination'
    ],
    'English': [
      'Reading Comprehension', 'Cloze Test', 'Para Jumbles', 'Error Spotting',
      'Fill in the Blanks', 'Phrase Replacement', 'Vocabulary', 'Grammar'
    ],
    'General Intelligence & Reasoning': [
      'Syllogism', 'Seating Arrangement', 'Blood Relations', 'Directions',
      'Coding-Decoding', 'Puzzles', 'Analogies', 'Series'
    ],
    'General Awareness': [
      'Current Affairs', 'Static GK', 'Polity', 'Economy',
      'Geography', 'History', 'Science & Tech'
    ]
  };

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

  const getAllTopicsForSubject = (subject: string): string[] => {
    const topicsSet = new Set<string>();
    const daily = Array.isArray(detailedSchedule?.daily_schedule)
      ? detailedSchedule!.daily_schedule
      : [];

    daily.forEach((day: any) => {
      (day.subjects || []).forEach((subj: any) => {
        if (normalize(subj.subject || '') === normalize(subject)) {
          (subj.topics || []).forEach((t: string) => topicsSet.add(t));
        }
      });
    });

    if (topicsSet.size > 0) return Array.from(topicsSet);
    return fallbackTopics[subject] || [];
  };

  const getSubjectStats = (subject: string) => {
    const subjectSessions = studySessions.filter(
      (s) => normalize(s.subject) === normalize(subject)
    );

    const totalHours = Math.round(
      (subjectSessions.reduce((sum, s) => sum + s.duration_minutes, 0) / 60) * 10
    ) / 10;

    const avgPerformance = subjectSessions.length > 0
      ? Math.round(
          (subjectSessions.reduce((sum, s) => sum + s.performance_score, 0) /
            subjectSessions.length) * 10
        ) / 10
      : 0;

    const allTopics = getAllTopicsForSubject(subject);
    const completedTopicSet = new Set<string>();
    const topicKeys = allTopics.map(normalize);

    subjectSessions.forEach((s) => {
      (s.topics_covered || []).forEach((covered: string) => {
        const key = normalize(covered);
        topicKeys.forEach((tk, i) => {
          if (tk && (key.includes(tk) || tk.includes(key))) {
            completedTopicSet.add(allTopics[i]);
          }
        });
      });
    });

    const completionPercentage = allTopics.length > 0
      ? Math.round((completedTopicSet.size / allTopics.length) * 100)
      : (progressReports.find((r) => normalize(r.subject) === normalize(subject))
          ?.completion_percentage || 0);

    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const yyyyMmDd = d.toISOString().split('T')[0];
      const studied = subjectSessions.some(
        (s) => (s.created_at || '').split('T')[0] === yyyyMmDd
      );
      if (studied) streak++;
      else if (i > 0) break;
    }

    return {
      totalHours,
      avgPerformance,
      completionPercentage,
      streak,
      totalSessions: subjectSessions.length,
      units: Math.max(allTopics.length || 0, 6),
      completedTopics: completedTopicSet.size,
      totalTopics: allTopics.length
    };
  };

  // Animate stats on mount
  useEffect(() => {
    const totalSubjects = availableSubjects.length;
    const completedSubjects = availableSubjects.filter(
      (subj) => getSubjectStats(subj).completionPercentage >= 80
    ).length;
    const totalStudyHours = Math.round(
      (studySessions.reduce((s, x) => s + x.duration_minutes, 0) / 60) * 10
    ) / 10;
    const currentStreak = Math.max(
      0,
      ...availableSubjects.map((subject) => getSubjectStats(subject).streak)
    );

    // Animate numbers
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

    setTimeout(() => {
      animateValue(0, totalSubjects, (val) => 
        setAnimatedStats(prev => ({ ...prev, totalSubjects: val })), 800);
      animateValue(0, completedSubjects, (val) => 
        setAnimatedStats(prev => ({ ...prev, completedSubjects: val })), 1000);
      animateValue(0, totalStudyHours, (val) => 
        setAnimatedStats(prev => ({ ...prev, totalStudyHours: val })), 1200);
      animateValue(0, currentStreak, (val) => 
        setAnimatedStats(prev => ({ ...prev, currentStreak: val })), 1400);
    }, 300);
  }, [availableSubjects, studySessions]);

  const getSubjectGradient = (index: number) => {
    const gradients = [
      'from-blue-500 via-blue-600 to-indigo-700',
      'from-emerald-500 via-green-600 to-teal-700',
      'from-purple-500 via-violet-600 to-purple-700',
      'from-orange-500 via-red-500 to-pink-600',
      'from-cyan-500 via-blue-500 to-indigo-600',
      'from-yellow-500 via-orange-500 to-red-500'
    ];
    return gradients[index % gradients.length];
  };

  const getStatusInfo = (stats: any) => {
    if (stats.completionPercentage >= 80) {
      return {
        status: 'Mastered',
        icon: Crown,
        color: 'text-yellow-600',
        bgColor: 'bg-gradient-to-r from-yellow-50 to-amber-50',
        borderColor: 'border-yellow-200'
      };
    } else if (stats.completionPercentage >= 50) {
      return {
        status: 'In Progress',
        icon: TrendingUp,
        color: 'text-emerald-600',
        bgColor: 'bg-gradient-to-r from-emerald-50 to-green-50',
        borderColor: 'border-emerald-200'
      };
    } else if (stats.completionPercentage > 0) {
      return {
        status: 'Started',
        icon: Play,
        color: 'text-blue-600',
        bgColor: 'bg-gradient-to-r from-blue-50 to-sky-50',
        borderColor: 'border-blue-200'
      };
    } else {
      return {
        status: 'Start Learning',
        icon: Sparkles,
        color: 'text-slate-600',
        bgColor: 'bg-gradient-to-r from-slate-50 to-gray-50',
        borderColor: 'border-slate-200'
      };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 lg:px-0">
      {/* Enhanced Header with Animated Stats */}
      <div className="relative overflow-hidden dark:from-slate-900 dark:via-gray-800 dark:to-slate-950 bg-gradient-to-br from-indigo-600 via-sky-600 to-sky-600/80 p-8 rounded-3xl text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-24 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">My Learning Journey</h2>
              <p className="text-indigo-100 text-sm">
                Master your subjects with daily milestones and real-time progress tracking
              </p>
            </div>
          </div>
          
          {/* Animated Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                {animatedStats.totalSubjects}
              </div>
              <div className="text-indigo-100 text-xs font-medium">Total Courses</div>
              <div className="mt-2 w-full bg-white/20 rounded-full h-1">
                <div 
                  className="bg-white h-1 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(animatedStats.totalSubjects / 6) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                {animatedStats.completedSubjects}
              </div>
              <div className="text-indigo-100 text-xs font-medium">Mastered</div>
              <div className="mt-2 flex items-center justify-center space-x-1">
                {Array.from({ length: animatedStats.totalSubjects }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-500 delay-${i * 100}`}
                    style={{
                      backgroundColor: i < animatedStats.completedSubjects ? '#10b981' : 'rgba(255,255,255,0.3)',
                      animationDelay: `${i * 100}ms`
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                {animatedStats.totalStudyHours}h
              </div>
              <div className="text-indigo-100 text-xs font-medium">Study Hours</div>
              <div className="mt-2 flex items-center justify-center space-x-1">
                <Clock className="w-4 h-4 text-purple-200" />
                <span className="text-xs text-purple-200">Total Time Invested</span>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Flame className="w-6 h-6 text-orange-300 animate-pulse" />
                <div className="text-3xl font-bold bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                  {animatedStats.currentStreak}
                </div>
              </div>
              <div className="text-indigo-100 text-xs font-medium">Day Streak</div>
              <div className="mt-2 text-xs text-orange-200">Keep the momentum!</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Course Grid */}
      {availableSubjects.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {availableSubjects.map((subject, index) => {
          const stats = getSubjectStats(subject);
          const statusInfo = getStatusInfo(stats);
          const isHovered = hoveredCard === subject;
          const hasFreeLessons = index < 2;
          
          return (
            <div
              key={subject}
              onMouseEnter={() => setHoveredCard(subject)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(`/app/courses/${encodeURIComponent(subject)}`)}
              className={`group relative bg-white rounded-3xl shadow-lg border-2 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${statusInfo.borderColor} ${
                isHovered ? 'scale-105' : ''
              }`}
              style={{
    background: isHovered
      ? `linear-gradient(135deg, ${statusInfo.bgColor
          .replace('bg-gradient-to-r ', '')
          .replace('from-', '')
          .replace(' to-', ', ')})`
      : 'white', 
  }}
            >
              {/* Free Lessons Badge */}
              {hasFreeLessons && (
                <div className="absolute -top-3 -right-3 z-10">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-bounce">
                    <Star className="w-3 h-3 inline mr-1" />
                    2 FREE LESSONS
                  </div>
                </div>
              )}
              
              {/* Mastery Badge */}
              {stats.completionPercentage >= 80 && (
                <div className="absolute -top-2 -left-2 z-10">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Subject Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${getSubjectGradient(index)} rounded-3xl flex items-center justify-center text-4xl shadow-lg transform transition-all duration-300 ${
                    isHovered ? 'rotate-12 scale-110' : ''
                  }`}>
                    {subjectIcons[subject] || '📖'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                      {subject}
                    </h3>
                    <p className="text-slate-500 text-sm">{stats.units} learning units</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-400">{stats.totalSessions} sessions</span>
                      </div>
                      <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-400">{stats.completedTopics}/{stats.totalTopics} topics</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-6 h-6 text-slate-400 transition-all duration-300 ${
                    isHovered ? 'translate-x-2 text-indigo-600' : ''
                  }`} />
                </div>

                {/* Dynamic Progress Visualization */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-700">Learning Progress</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-slate-800">{stats.completionPercentage}%</span>
                      {stats.completionPercentage > 0 && (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${
                          stats.completionPercentage >= 80 ? 'from-yellow-400 to-orange-500' :
                          stats.completionPercentage >= 50 ? 'from-emerald-400 to-green-500' :
                          stats.completionPercentage > 0 ? 'from-blue-400 to-indigo-500' : 'from-slate-300 to-slate-400'
                        }`}
                        style={{ 
                          width: `${Math.min(stats.completionPercentage, 100)}%`,
                          animationDelay: `${index * 200}ms`
                        }}
                      />
                    </div>
                    {/* Progress Sparkles */}
                    {stats.completionPercentage > 0 && (
                      <div className="absolute top-0 left-0 w-full h-full flex items-center">
                        <Sparkles className="w-4 h-4 text-white animate-ping" style={{ 
                          left: `${Math.min(stats.completionPercentage, 100)}%`,
                          transform: 'translateX(-50%)'
                        }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-lg font-bold text-slate-800">{stats.totalHours}h</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Study Time</span>
                    {stats.totalHours > 0 && (
                      <div className="mt-1 text-xs text-blue-600">+{Math.round(stats.totalHours * 10)}pts</div>
                    )}
                  </div>
                  
                  <div className="text-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <Award className="w-4 h-4 text-purple-600" />
                      <span className="text-lg font-bold text-slate-800">{stats.avgPerformance}/10</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Avg Score</span>
                    {stats.avgPerformance >= 8 && (
                      <div className="mt-1 text-xs text-purple-600">Excellent!</div>
                    )}
                  </div>
                  
                  <div className="text-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-lg font-bold text-slate-800">{stats.streak}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Day Streak</span>
                    {stats.streak >= 7 && (
                      <div className="mt-1 text-xs text-orange-600">On Fire! 🔥</div>
                    )}
                  </div>
                </div>

                {/* Enhanced Status Badge */}
                <div className="flex justify-center mb-4">
                  <div className={`px-6 py-3 rounded-2xl ${statusInfo.bgColor} ${statusInfo.borderColor} border-2 transition-all duration-300 ${
                    isHovered ? 'scale-110 shadow-lg' : ''
                  }`}>
                    <div className="flex items-center space-x-2">
                      <statusInfo.icon className={`w-5 h-5 ${statusInfo.color}`} />
                      <span className={`font-bold ${statusInfo.color}`}>{statusInfo.status}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                  <button className={`w-full py-4 px-6 bg-gradient-to-r ${getSubjectGradient(index)} text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2`}>
                    <Play className="w-5 h-5" />
                    <span>Continue Learning</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Hover Overlay Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`} 
                style={{ zIndex: -90 }}/>
            </div>
          );
        })}
      </div>
      ) : ( // MODIFICATION START: No courses available message
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 text-center">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-slate-800 mb-3">No Courses Available</h3>
          <p className="text-slate-600 mb-6">
            It looks like you haven't generated a study plan yet.
            Generate a personalized study plan to see your courses here!
          </p>
          <button
            onClick={() => navigate('/app/enhanced-schedule')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Calendar className="w-5 h-5" />
            <span>Generate Study Plan</span>
          </button>
        </div>
      )} {/* MODIFICATION END */}


      {/* Learning Insights Panel */}
      <div className="bg-gradient-to-r mt-8 from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Learning Insights</h3>
            <p className="text-slate-300">Smart analysis of your study patterns</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <span className="font-semibold">Performance Trend</span>
            </div>
            <div className="text-3xl font-bold mb-2">
              {studySessions.length > 0 
                ? Math.round(studySessions.reduce((sum, s) => sum + s.performance_score, 0) / studySessions.length * 10) / 10
                : 0}/10
            </div>
            <p className="text-slate-300 text-sm">Average across all subjects</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-blue-400" />
              <span className="font-semibold">Completion Rate</span>
            </div>
            <div className="text-3xl font-bold mb-2">
              {availableSubjects.length > 0 
                ? Math.round(availableSubjects.reduce((sum, subj) => sum + getSubjectStats(subj).completionPercentage, 0) / availableSubjects.length)
                : 0}%
            </div>
            <p className="text-slate-300 text-sm">Overall curriculum progress</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Flame className="w-6 h-6 text-orange-400" />
              <span className="font-semibold">Study Momentum</span>
            </div>
            <div className="text-3xl font-bold mb-2">
              {animatedStats.currentStreak >= 7 ? 'High' : animatedStats.currentStreak >= 3 ? 'Good' : 'Building'}
            </div>
            <p className="text-slate-300 text-sm">{animatedStats.currentStreak} consecutive days</p>
          </div>
        </div>
      </div>


      {/* Enhanced Quick Actions */}
      <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
        
        <div className="p-8">
          <div className="dark:from-slate-800/80 bg-gradient-to-r from-slate-50 to-gray-50 py-6 border-b border-slate-200">
          <h3 className="text-2xl dark:text-white/80 font-bold text-slate-800 mb-2">Quick Actions</h3>
          <p className="text-slate-600 dark:text-white/80">Accelerate your learning with these powerful tools</p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => navigate('/app/enhanced-schedule')}
              className="group relative overflow-hidden bg-gradient-to-br from-sky-100 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-sky-500/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Set Daily Goals</h4>
                <p className="text-slate-600 text-sm mb-4">Create personalized milestone targets and track your daily achievements</p>
                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                  <span>Create Goals</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
            
            <div 
              onClick={() => navigate('/app/analytics')}
              className="group relative overflow-hidden bg-gradient-to-br from-purple-100 to-violet-50 hover:from-purple-100 hover:to-violet-100 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">View Achievements</h4>
                <p className="text-slate-600 text-sm mb-4">Celebrate your learning milestones and track your progress journey</p>
                <div className="flex items-center text-purple-600 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                  <span>View Progress</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
            
            <div 
              onClick={() => navigate('/app/ai-mentor')}
              className="group relative overflow-hidden bg-gradient-to-br from-green-100 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">AI Mentor</h4>
                <p className="text-slate-600 text-sm mb-4">Get personalized guidance from your AI study mentor</p>
                <div className="flex items-center text-green-600 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                  <span>Chat with AI</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default CourseList;