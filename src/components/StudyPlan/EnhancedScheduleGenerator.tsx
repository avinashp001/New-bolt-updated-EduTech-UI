import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Target, BookOpen, Brain, Clock, TrendingUp, Award, CheckCircle, AlertTriangle, Zap, Download, RefreshCw, Sparkles, Users, Trophy, Star, ArrowRight, Play, Eye, BarChart3 } from 'lucide-react';
import { useStudyPlan } from '../../hooks/useStudyPlan';
import { useDetailedSchedule } from '../../hooks/useDetailedSchedule';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../Common/LoadingSpinner';
import html2pdf from 'html2pdf.js';

const EnhancedScheduleGenerator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { studyPlan, generateStudyPlan, loading: studyPlanLoading } = useStudyPlan(user?.id);
  const { detailedSchedule, loading: detailedScheduleLoading } = useDetailedSchedule(user?.id);
  const { showSuccess, showError } = useNotification();
  
  const [examType, setExamType] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [dailyHours, setDailyHours] = useState(6);
  const [targetDate, setTargetDate] = useState('');
  const [currentLevel, setCurrentLevel] = useState('intermediate');
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
  const [preferredStudyTime, setPreferredStudyTime] = useState('morning');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const subjectOptions: { [key: string]: string[] } = {
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
      showError('Missing Information', 'Please fill in all required fields.');
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
      showSuccess('Study Plan Generated!', 'Your personalized study plan has been created successfully.');
    } catch (error) {
      console.error('Error generating study plan:', error);
      showError('Generation Failed', 'Error generating study plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!detailedSchedule) {
      showError('No Schedule', 'Please generate a study plan first.');
      return;
    }

    setIsDownloading(true);
    
    try {
      // Create a printable version of the schedule
      const printContent = createPrintableSchedule();
      
      const opt = {
        margin: 0.5,
        filename: `${examType.replace(/[^a-zA-Z0-9]/g, '_')}_study_plan.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: false, dpi: 192, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(printContent).save();
      showSuccess('PDF Downloaded!', 'Your study plan has been downloaded successfully.');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      showError('Download Failed', 'Error downloading PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const createPrintableSchedule = () => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #1e40af; margin-bottom: 20px;">${examType} Study Plan</h1>
        <p><strong>Target Date:</strong> ${targetDate}</p>
        <p><strong>Daily Hours:</strong> ${dailyHours}</p>
        <p><strong>Subjects:</strong> ${subjects.join(', ')}</p>
        ${weakSubjects.length > 0 ? `<p><strong>Focus Areas:</strong> ${weakSubjects.join(', ')}</p>` : ''}
        
        <h2 style="color: #059669; margin-top: 30px;">Weekly Schedule</h2>
        ${getScheduleHTML()}
      </div>
    `;
    return div;
  };

  const getScheduleHTML = () => {
    if (!detailedSchedule?.daily_schedule) return '<p>No schedule available</p>';
    
    const dailyScheduleArray = Array.isArray(detailedSchedule.daily_schedule)
      ? detailedSchedule.daily_schedule
      : [];

    return dailyScheduleArray.slice(0, 14).map((day: any, index: number) => `
      <div style="margin-bottom: 20px; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
        <h3 style="color: #374151; margin-bottom: 10px;">Day ${index + 1} - ${day.dayOfWeek} (${day.date})</h3>
        ${day.subjects?.map((subject: any) => `
          <div style="margin-bottom: 10px;">
            <strong>${subject.subject}</strong> (${subject.hours}h) - ${subject.timeSlot}
            <br><em>Topics: ${subject.topics?.join(', ') || 'General Study'}</em>
          </div>
        `).join('') || ''}
      </div>
    `).join('');
  };

  const getWeeklySchedule = () => {
    if (!detailedSchedule?.daily_schedule) return [];

    const dailyScheduleArray = Array.isArray(detailedSchedule.daily_schedule)
      ? detailedSchedule.daily_schedule
      : [];

    const daysPerWeek = 7;
    const startIndex = (selectedWeek - 1) * daysPerWeek;
    const endIndex = startIndex + daysPerWeek;
    
    return dailyScheduleArray.slice(startIndex, endIndex);
  };

  const getTotalWeeks = () => {
    if (!detailedSchedule?.daily_schedule) return 0;
    
    const dailyScheduleArray = Array.isArray(detailedSchedule.daily_schedule)
      ? detailedSchedule.daily_schedule
      : [];
    
    return Math.ceil(dailyScheduleArray.length / 7);
  };

  const getScheduleStats = () => {
    if (!detailedSchedule?.daily_schedule) return { totalDays: 0, totalHours: 0, subjectsCount: 0 };
    
    const dailyScheduleArray = Array.isArray(detailedSchedule.daily_schedule)
      ? detailedSchedule.daily_schedule
      : [];

    const totalDays = dailyScheduleArray.length;
    const totalHours = dailyScheduleArray.reduce((sum: number, day: any) => 
      sum + (day.totalHours || 0), 0);
    const allSubjects = new Set();
    
    dailyScheduleArray.forEach((day: any) => {
      day.subjects?.forEach((subject: any) => {
        allSubjects.add(subject.subject);
      });
    });

    return {
      totalDays,
      totalHours,
      subjectsCount: allSubjects.size
    };
  };

  const existingSchedule = detailedSchedule?.daily_schedule && Array.isArray(detailedSchedule.daily_schedule)
    ? detailedSchedule.daily_schedule
    : [];

  const weeklySchedule = getWeeklySchedule();
  const totalWeeks = getTotalWeeks();
  const scheduleStats = getScheduleStats();

  if (detailedScheduleLoading || studyPlanLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <LoadingSpinner message="Loading your study plan..." variant="brain" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 rounded-2xl text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-8 h-8" />
          <h2 className="text-2xl font-bold">AI Study Plan Generator</h2>
        </div>
        <p className="text-indigo-100">
          Create personalized study schedules with AI-powered optimization and topper strategies
        </p>
      </div>

      {!studyPlan || !detailedSchedule ? (
        <div className="space-y-6">
          {/* Plan Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h3>
              
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
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Student Profile</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Level
                  </label>
                  <select
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="early-morning">Early Morning (4-8 AM)</option>
                    <option value="morning">Morning (8-12 PM)</option>
                    <option value="afternoon">Afternoon (12-6 PM)</option>
                    <option value="evening">Evening (6-10 PM)</option>
                    <option value="night">Night (10 PM-2 AM)</option>
                    <option value="flexible">Flexible (Anytime)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Selection */}
          {examType && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Subject Selection *</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {(subjectOptions[examType] || []).map(subject => (
                  <button
                    key={subject}
                    onClick={() => handleSubjectToggle(subject)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span>Identify Weak Subjects (Optional)</span>
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Select subjects you find challenging. These will get extra focus in your plan.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {subjects.map(subject => (
                  <button
                    key={subject}
                    onClick={() => handleWeakSubjectToggle(subject)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
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
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Intelligent Plan...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Generate AI Study Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Plan Overview */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{studyPlan.exam_type} Study Plan</h3>
                <p className="text-slate-600">
                  {scheduleStats.totalDays} days • {scheduleStats.totalHours}h total • {scheduleStats.subjectsCount} subjects
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setStudyPlan(null);
                    setDetailedSchedule(null);
                  }}
                  className="bg-slate-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Generate New Plan</span>
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{scheduleStats.totalDays}</div>
                <div className="text-sm text-blue-800">Total Days</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{scheduleStats.totalHours}h</div>
                <div className="text-sm text-green-800">Study Hours</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{scheduleStats.subjectsCount}</div>
                <div className="text-sm text-purple-800">Subjects</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{totalWeeks}</div>
                <div className="text-sm text-orange-800">Weeks</div>
              </div>
            </div>

            <>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">
                    📅 Complete {existingSchedule.length}-day schedule generated
                  </p>
                  <p className="text-blue-600 text-sm mt-1">
                    Your personalized daily study plan is ready with subject rotation and milestone tracking
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => setShowFullSchedule(!showFullSchedule)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                  >
                    <Eye className="w-5 h-5" />
                    <span>{showFullSchedule ? 'Hide' : 'View'} Full Schedule</span>
                  </button>
                  <button
                    onClick={() => navigate('/app/courses')}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Learning</span>
                  </button>
                  <button
                    onClick={() => navigate('/app/analytics')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>View Analytics</span>
                  </button>
                </div>
              </div>
            </>
          </div>

          {/* Weekly Navigation */}
          {existingSchedule.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-800">Weekly Schedule View</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
                    disabled={selectedWeek === 1}
                    className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <span className="font-medium text-slate-700">
                    Week {selectedWeek} of {totalWeeks}
                  </span>
                  <button
                    onClick={() => setSelectedWeek(Math.min(totalWeeks, selectedWeek + 1))}
                    disabled={selectedWeek === totalWeeks}
                    className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Weekly Schedule Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                {weeklySchedule.map((day: any, index: number) => (
                  <div key={index} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="text-center mb-3">
                      <h4 className="font-semibold text-slate-800">{day.dayOfWeek}</h4>
                      <p className="text-xs text-slate-500">{day.date}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {day.subjects?.map((subject: any, subjectIndex: number) => (
                        <div key={subjectIndex} className="text-xs">
                          <div className="font-medium text-slate-700">{subject.subject}</div>
                          <div className="text-slate-500">{subject.hours}h • {subject.timeSlot}</div>
                          <div className="text-slate-400 mt-1">
                            {subject.topics?.slice(0, 2).join(', ') || 'General Study'}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-slate-200">
                      <div className="text-xs text-slate-500">
                        Total: {day.totalHours}h
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Schedule Display */}
          {showFullSchedule && existingSchedule.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Complete Study Schedule</h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {existingSchedule.map((day: any, index: number) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          Day {index + 1} - {day.dayOfWeek}
                        </h4>
                        <p className="text-sm text-slate-500">{day.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-700">{day.totalHours}h</div>
                        <div className="text-xs text-slate-500">Total Study</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {day.subjects?.map((subject: any, subjectIndex: number) => (
                        <div key={subjectIndex} className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-slate-800">{subject.subject}</span>
                            <span className="text-sm text-slate-600">{subject.hours}h</span>
                          </div>
                          <div className="text-sm text-slate-600 mb-1">{subject.timeSlot}</div>
                          <div className="text-xs text-slate-500">
                            Topics: {subject.topics?.join(', ') || 'General Study'}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {day.motivationalNote && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-700">{day.motivationalNote}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => navigate('/app/courses')}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300 text-left"
              >
                <BookOpen className="w-8 h-8 mb-4 text-blue-400" />
                <h4 className="font-semibold mb-2">Start Learning</h4>
                <p className="text-slate-300 text-sm">Begin your study journey with your courses</p>
              </button>
              
              <button
                onClick={() => navigate('/app/analytics')}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300 text-left"
              >
                <BarChart3 className="w-8 h-8 mb-4 text-green-400" />
                <h4 className="font-semibold mb-2">View Analytics</h4>
                <p className="text-slate-300 text-sm">Track your progress and performance</p>
              </button>
              
              <button
                onClick={() => navigate('/app/ai-mentor')}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300 text-left"
              >
                <Brain className="w-8 h-8 mb-4 text-purple-400" />
                <h4 className="font-semibold mb-2">AI Mentor</h4>
                <p className="text-slate-300 text-sm">Get personalized guidance and tips</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedScheduleGenerator;