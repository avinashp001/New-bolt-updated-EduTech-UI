import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Target, BookOpen, Brain, Clock, TrendingUp, Award, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { useStudyPlan } from '../../hooks/useStudyPlan';
import { useAuth } from '../../hooks/useAuth';

const StudyPlanGenerator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { studyPlan, generateStudyPlan, loading } = useStudyPlan(user?.id);
  
  const [examType, setExamType] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [dailyHours, setDailyHours] = useState(6);
  const [targetDate, setTargetDate] = useState('');
  const [currentLevel, setCurrentLevel] = useState('intermediate');
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
  const [preferredStudyTime, setPreferredStudyTime] = useState('morning');
  const [isGenerating, setIsGenerating] = useState(false);

  const examTypes = [
    'UPSC Civil Services',
    'SSC CGL',
    'Banking (SBI PO/Clerk)',
    'JEE Main/Advanced',
    'NEET',
    'CAT',
    'GATE',
    'Board Exams (Class 12)',
    'University Exams',
  ];

  const subjectOptions = {
    'UPSC Civil Services': ['History', 'Geography', 'Polity', 'Economics', 'Current Affairs', 'Ethics', 'Public Administration'],
    'SSC CGL': ['Quantitative Aptitude', 'English', 'General Intelligence', 'General Awareness'],
    'Banking (SBI PO/Clerk)': ['Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness', 'Computer Knowledge'],
    'JEE Main/Advanced': ['Physics', 'Chemistry', 'Mathematics'],
    'NEET': ['Physics', 'Chemistry', 'Biology'],
    'CAT': ['Quantitative Ability', 'Verbal Ability', 'Data Interpretation', 'Logical Reasoning'],
    'GATE': ['Engineering Mathematics', 'Technical Subject', 'General Aptitude'],
    'Board Exams (Class 12)': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'],
    'University Exams': ['Core Subjects', 'Electives', 'Practical', 'Project Work'],
  };

  const handleSubjectToggle = (subject: string) => {
    setSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleWeakSubjectToggle = (subject: string) => {
    setWeakSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const generateIntelligentPlan = async () => {
    if (!examType || subjects.length === 0 || !targetDate || !user) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsGenerating(true);
    
    try {
      const studentProfile = {
        currentLevel,
        weakSubjects,
        preferredStudyTime,
        examType,
        targetDate
      };

      await generateStudyPlan(examType, subjects, dailyHours, targetDate, studentProfile);
    } catch (error) {
      console.error('Error generating study plan:', error);
      alert('Error generating study plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getWeeklySchedule = () => {
    if (!studyPlan) return [];

    const schedule = [];
    const totalWeeks = studyPlan.total_duration_weeks;
    
    for (let week = 1; week <= Math.min(totalWeeks, 12); week++) {
      // Topper's Strategy: Intelligent subject rotation
      const weekSubjects = subjects.slice((week - 1) % subjects.length, ((week - 1) % subjects.length) + Math.min(3, subjects.length));
      
      schedule.push({
        week,
        days: [
          {
            day: 'Monday',
            type: 'study',
            focus: 'New Concepts',
            subjects: weekSubjects,
            hours: dailyHours,
            strategy: 'Deep Learning Phase - Focus on understanding fundamentals',
            bgColor: 'bg-blue-50 border-blue-200',
            textColor: 'text-blue-800',
            icon: BookOpen
          },
          {
            day: 'Tuesday',
            type: 'study',
            focus: 'Practice & Application',
            subjects: weekSubjects,
            hours: dailyHours,
            strategy: 'Application Phase - Solve problems and practice questions',
            bgColor: 'bg-blue-50 border-blue-200',
            textColor: 'text-blue-800',
            icon: Target
          },
          {
            day: 'Wednesday',
            type: 'study',
            focus: 'Advanced Topics',
            subjects: weekSubjects,
            hours: dailyHours,
            strategy: 'Mastery Phase - Tackle advanced concepts and challenging problems',
            bgColor: 'bg-blue-50 border-blue-200',
            textColor: 'text-blue-800',
            icon: Brain
          },
          {
            day: 'Thursday',
            type: 'study',
            focus: 'Integration & Synthesis',
            subjects: weekSubjects,
            hours: dailyHours,
            strategy: 'Integration Phase - Connect concepts across topics',
            bgColor: 'bg-blue-50 border-blue-200',
            textColor: 'text-blue-800',
            icon: TrendingUp
          },
          {
            day: 'Friday',
            type: 'study',
            focus: 'Consolidation',
            subjects: weekSubjects,
            hours: Math.floor(dailyHours * 0.7),
            strategy: 'Consolidation Phase - Review and strengthen understanding',
            bgColor: 'bg-blue-50 border-blue-200',
            textColor: 'text-blue-800',
            icon: CheckCircle
          },
          {
            day: 'Saturday',
            type: 'revision',
            focus: 'Comprehensive Revision',
            subjects: ['All Subjects'],
            hours: Math.floor(dailyHours * 0.8),
            strategy: 'Revision Day - Review entire week\'s learning with active recall',
            bgColor: 'bg-orange-50 border-orange-200',
            textColor: 'text-orange-800',
            icon: Clock
          },
          {
            day: 'Sunday',
            type: 'assessment',
            focus: 'Mock Tests & Analysis',
            subjects: ['Mock Tests', 'Weakness Analysis'],
            hours: Math.floor(dailyHours * 0.6),
            strategy: 'Assessment Day - Mock tests, weakness identification, and improvement planning',
            bgColor: 'bg-orange-50 border-orange-200',
            textColor: 'text-orange-800',
            icon: Award
          }
        ]
      });
    }
    
    return schedule;
  };

  const getToppersInsights = () => [
    {
      title: "80-20 Rule Application",
      description: "Focus 80% time on high-weightage topics that yield 80% marks",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Spaced Repetition",
      description: "Review topics at increasing intervals: 1 day, 3 days, 1 week, 1 month",
      icon: Clock,
      color: "text-blue-600"
    },
    {
      title: "Active Recall Method",
      description: "Test yourself without looking at notes - most effective learning technique",
      icon: Brain,
      color: "text-purple-600"
    },
    {
      title: "Weakness-First Strategy",
      description: "Tackle weak subjects during peak energy hours for maximum improvement",
      icon: AlertTriangle,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6 px-4 lg:px-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-4 lg:p-6 rounded-2xl text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-6 lg:w-8 h-6 lg:h-8" />
          <h2 className="text-xl lg:text-2xl font-bold">Intelligent Study Plan Generator</h2>
        </div>
        <p className="text-indigo-100 text-sm lg:text-base">
          AI-powered study planning with 20+ years of topper strategies and proven methodologies
        </p>
      </div>

      {!studyPlan ? (
        <div className="space-y-4 lg:space-y-6">
          {/* Topper's Insights */}
          <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-base lg:text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span>Topper's Success Strategies</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
              {getToppersInsights().map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 lg:p-4 bg-slate-50 rounded-lg">
                  <insight.icon className={`w-5 h-5 mt-1 ${insight.color}`} />
                  <div>
                    <h4 className="font-medium text-slate-800 text-sm lg:text-base">{insight.title}</h4>
                    <p className="text-xs lg:text-sm text-slate-600 mt-1">{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Basic Information */}
            <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-base lg:text-lg font-semibold text-slate-800 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Target Exam *
                  </label>
                  <select
                    value={examType}
                    onChange={(e) => {
                      setExamType(e.target.value);
                      setSubjects([]);
                      setWeakSubjects([]);
                    }}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm lg:text-base"
                  >
                    <option value="">Select your target exam</option>
                    {examTypes.map(exam => (
                      <option key={exam} value={exam}>{exam}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Target Date *
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Daily Study Hours: {dailyHours}h
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="12"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>2h</span>
                    <span>6h</span>
                    <span>12h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Profile */}
            <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-base lg:text-lg font-semibold text-slate-800 mb-4">Student Profile</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Level
                  </label>
                  <select
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm lg:text-base"
                  >
                    <option value="beginner">Beginner (Just started preparation)</option>
                    <option value="intermediate">Intermediate (Some preparation done)</option>
                    <option value="advanced">Advanced (Well-prepared, need optimization)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred Study Time
                  </label>
                  <select
                    value={preferredStudyTime}
                    onChange={(e) => setPreferredStudyTime(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm lg:text-base"
                  >
                    <option value="early-morning">Early Morning (4-8 AM)</option>
                    <option value="morning">Morning (8-12 PM)</option>
                    <option value="afternoon">Afternoon (12-6 PM)</option>
                    <option value="evening">Evening (6-10 PM)</option>
                    <option value="night">Night (10 PM-2 AM)</option>
                    <option value="flexible">Flexible (07 AM-9 PM)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Selection */}
          {examType && (
            <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-base lg:text-lg font-semibold text-slate-800 mb-4">Subject Selection *</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
                {subjectOptions[examType as keyof typeof subjectOptions]?.map(subject => (
                  <button
                    key={subject}
                    onClick={() => handleSubjectToggle(subject)}
                    className={`p-2 lg:p-3 rounded-lg border-2 transition-all text-xs lg:text-sm font-medium ${
                      subjects.includes(subject)
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Weak Subjects */}
          {subjects.length > 0 && (
            <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-base lg:text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span>Identify Weak Subjects (Optional)</span>
              </h3>
              <p className="text-xs lg:text-sm text-slate-600 mb-4">
                Select subjects you find challenging. These will get extra focus in your plan.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
                {subjects.map(subject => (
                  <button
                    key={subject}
                    onClick={() => handleWeakSubjectToggle(subject)}
                    className={`p-2 lg:p-3 rounded-lg border-2 transition-all text-xs lg:text-sm font-medium ${
                      weakSubjects.includes(subject)
                        ? 'border-orange-500 bg-orange-50 text-orange-800'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={generateIntelligentPlan}
              disabled={!examType || subjects.length === 0 || !targetDate || isGenerating}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto text-sm lg:text-base"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Intelligent Plan...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Generate Topper's Strategy Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 lg:space-y-6">
          {/* Plan Overview */}
          <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-slate-800">{studyPlan.exam_type} Study Plan</h3>
                <p className="text-sm lg:text-base text-slate-600">
                  {studyPlan.total_duration_weeks} weeks • {studyPlan.daily_hours}h/day • {studyPlan.subjects.length} subjects
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="text-center">
                  <div className="text-lg lg:text-xl font-bold text-indigo-600">
                    {studyPlan.total_duration_weeks * studyPlan.daily_hours * 6}h
                  </div>
                  <div className="text-xs lg:text-sm text-slate-500">Total Study Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-lg lg:text-xl font-bold text-green-600">
                    {Math.ceil(studyPlan.total_duration_weeks / 4)}
                  </div>
                  <div className="text-xs lg:text-sm text-slate-500">Months to Goal</div>
                </div>
              </div>
            </div>

            {/* Weekly Schedule */}
            <div className="space-y-4 lg:space-y-6">
              <h4 className="text-base lg:text-lg font-semibold text-slate-800 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>Topper's Weekly Schedule Pattern</span>
              </h4>
              
              {getWeeklySchedule().slice(0, 4).map((weekData, weekIndex) => (
                <div key={weekIndex} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 lg:px-6 py-3 border-b border-slate-200">
                    <h5 className="font-semibold text-slate-800 text-sm lg:text-base">
                      Week {weekData.week} Pattern (Repeats throughout your preparation)
                    </h5>
                  </div>
                  
                  <div className="p-4 lg:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3 lg:gap-4">
                      {weekData.days.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`p-3 lg:p-4 rounded-lg border-2 ${day.bgColor} transition-all hover:shadow-md`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h6 className={`font-semibold text-sm lg:text-base ${day.textColor}`}>
                              {day.day}
                            </h6>
                            <day.icon className={`w-4 h-4 ${day.textColor}`} />
                          </div>
                          
                          <div className="space-y-2">
                            <div className={`text-xs lg:text-sm font-medium ${day.textColor}`}>
                              {day.focus}
                            </div>
                            
                            <div className="text-xs text-slate-600">
                              <div className="font-medium mb-1">Subjects:</div>
                              {day.subjects.map((subject, idx) => (
                                <div key={idx} className="truncate">{subject}</div>
                              ))}
                            </div>
                            
                            <div className={`text-xs ${day.textColor} font-medium`}>
                              {day.hours}h study time
                            </div>
                            
                            <div className="text-xs text-slate-500 mt-2 hidden lg:block">
                              {day.strategy}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Strategy Explanation */}
            <div className="mt-6 p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h4 className="text-base lg:text-lg font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>Why This Schedule Works (Topper's Secret)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm lg:text-base">
                <div>
                  <h5 className="font-medium text-blue-700 mb-2">Monday-Friday (Study Phase)</h5>
                  <ul className="space-y-1 text-blue-600">
                    <li>• Progressive learning: Concepts → Practice → Mastery</li>
                    <li>• Peak brain performance on weekdays</li>
                    <li>• Consistent routine builds momentum</li>
                    <li>• Deep focus without weekend distractions</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-orange-700 mb-2">Saturday-Sunday (Consolidation)</h5>
                  <ul className="space-y-1 text-orange-600">
                    <li>• Revision strengthens neural pathways</li>
                    <li>• Mock tests simulate exam conditions</li>
                    <li>• Weakness analysis prevents knowledge gaps</li>
                    <li>• Mental refresh prevents burnout</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={() => navigate('/app/enhanced-schedule', { replace: true })}
              className="bg-slate-600 text-white px-6 lg:px-8 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors text-sm lg:text-base"
            >
              Generate New Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanGenerator;