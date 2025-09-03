import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Target, 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Brain, 
  Upload, 
  FileText, 
  Plus, 
  X,
  Play,
  Award,
  Clock,
  Zap,
  Star,
  Crown,
  Flame,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Sparkles,
  Trophy,
  ArrowRight,
  Download,
  Eye,
  RotateCcw
} from 'lucide-react';
import { useStudyPlan } from '../../hooks/useStudyPlan';
import { useProgress } from '../../hooks/useProgress';
import { useAuth } from '../../hooks/useAuth';
import { useDropzone } from 'react-dropzone';
import { AIService } from '../../lib/mistralAI';
import { PDFParser } from '../../lib/pdfParser';
import { supabase, WeeklyAssessment } from '../../lib/supabase';
import { useDetailedSchedule } from '../../hooks/useDetailedSchedule';

interface WeeklyTest {
  id: string;
  week: number;
  subject: string;
  fileName: string;
  fileContent: string;
  score: number;
  completedAt: string;
  questions: any[];
  userAnswers: number[];
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  analysis: {
    strongAreas: string[];
    weakAreas: string[];
    recommendations: string[];
    nextSteps: string[];
    weeklyGuidance: string;
  };
}

interface SubjectAssessment {
  subject: string;
  completed: boolean;
  score?: number;
  fileName?: string;
  completedAt?: string;
}

const WeeklyPlanTracker: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { studyPlan } = useStudyPlan(user?.id);
  const { detailedSchedule, detailedScheduleLoading } = useDetailedSchedule(user?.id);
  const { addStudySession, progressReports } = useProgress(user?.id, detailedSchedule, detailedScheduleLoading);
  
  const initialSubject = location.state?.initialSubject || '';
  const initialTopic = location.state?.initialTopic || '';
  
  const [currentWeek, setCurrentWeek] = useState(1);
  const [fetchedWeeklyAssessments, setFetchedWeeklyAssessments] = useState<WeeklyAssessment[]>([]);
  const [weeklyAssessments, setWeeklyAssessments] = useState<Record<number, SubjectAssessment[]>>({});
  const [activeSubject, setActiveSubject] = useState('');
  const [uploadingSubject, setUploadingSubject] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [showTestInterface, setShowTestInterface] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [testStartTime, setTestStartTime] = useState<Date | null>(null);
  const [uploadedContent, setUploadedContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [animatedWeekStats, setAnimatedWeekStats] = useState({
    totalWeeks: 0,
    completedWeeks: 0,
    currentProgress: 0
  });

  useEffect(() => {
    if (initialSubject && initialTopic) {
      setUploadingSubject(initialSubject);
    }
  }, [initialSubject, initialTopic]);

  useEffect(() => {
    if (studyPlan) {
      const planStartDate = new Date(studyPlan.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - planStartDate.getTime());
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
      const calculatedWeek = Math.min(diffWeeks, studyPlan.total_duration_weeks);
      setCurrentWeek(calculatedWeek);
      
      initializeWeeklyAssessments(calculatedWeek);
      
      // Animate stats
      setTimeout(() => {
        setAnimatedWeekStats({
          totalWeeks: studyPlan.total_duration_weeks,
          completedWeeks: Math.max(0, calculatedWeek - 1),
          currentProgress: Math.round((calculatedWeek / studyPlan.total_duration_weeks) * 100)
        });
      }, 500);
    }
  }, [studyPlan]);

  useEffect(() => {
    const fetchWeeklyAssessments = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('weekly_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching weekly assessments:', error);
      } else {
        setFetchedWeeklyAssessments(data || []);
      }
    };
    fetchWeeklyAssessments();
  }, [user?.id]);

  const initializeWeeklyAssessments = (week: number) => {
    if (!studyPlan) return;
    
    setWeeklyAssessments(prev => {
      if (prev[week]) return prev;
      
      const weekSubjects = studyPlan.subjects.map(subject => ({
        subject,
        completed: false
      }));
      
      return {
        ...prev,
        [week]: weekSubjects
      };
    });
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (!uploadingSubject || !studyPlan) {
      alert('Please select a subject first.');
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setFileName(file.name);

    try {
      const content = await PDFParser.extractTextFromFile(file);
      
      if (!PDFParser.validateFileContent(content)) {
        throw new Error('The file content could not be properly extracted or appears to be corrupted.');
      }
      
      setUploadedContent(content);
      
      const testQuestions = await AIService.generateTestQuestions(content, uploadingSubject);
      
      let parsedQuestions: any[];
      try {
        const firstBrace = testQuestions.indexOf('{');
        const lastBrace = testQuestions.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1) {
          const jsonString = testQuestions.substring(firstBrace, lastBrace + 1);
          const parsed = JSON.parse(jsonString);
          parsedQuestions = parsed.questions || [];
        } else {
          throw new Error('No valid JSON found');
        }
      } catch (parseError) {
        console.error('Error parsing AI questions:', parseError);
        parsedQuestions = createFallbackQuestions(content, uploadingSubject);
      }

      setQuestions(parsedQuestions);
      setUserAnswers(new Array(parsedQuestions.length).fill(-1));
      setActiveSubject(uploadingSubject);
      setShowTestInterface(true);
      setTestStartTime(new Date());
      
    } catch (error) {
      console.error('Error processing file:', error);
      const errorMessage = error instanceof Error ? error.message : `Error processing "${file.name}". Please try again.`;
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const createFallbackQuestions = (content: string, subject: string): any[] => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
    const keyTerms = content.toLowerCase().match(/\b[a-z]{4,}\b/g)?.slice(0, 10) || [];
    
    return [
      {
        id: '1',
        question: `Based on the uploaded content, what is the main topic discussed in ${subject}?`,
        options: [
          sentences[0]?.substring(0, 80) + '...' || 'Primary concept from content',
          sentences[1]?.substring(0, 80) + '...' || 'Alternative interpretation',
          'General theoretical approach',
          'Basic overview'
        ],
        correctAnswer: 0,
        explanation: `This is the main focus based on the uploaded content for ${subject}.`,
        topic: 'Content Analysis'
      },
      {
        id: '2',
        question: keyTerms.length > 0 ? 
          `The content mentions "${keyTerms[0]}" in the context of:` :
          `According to the material, what approach is emphasized?`,
        options: [
          sentences[2]?.substring(0, 80) + '...' || 'Content-specific approach',
          'Alternative method',
          'Different strategy',
          'General technique'
        ],
        correctAnswer: 0,
        explanation: 'This approach is emphasized in the uploaded material.',
        topic: 'Key Concepts'
      }
    ];
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  });

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishWeeklyTest();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishWeeklyTest = async () => {
    if (!testStartTime || !user || !studyPlan) return;

    setIsAnalyzing(true);
    const timeSpent = Math.floor((new Date().getTime() - testStartTime.getTime()) / 1000 / 60);
    
    try {
      const correctAnswers = userAnswers.reduce((count, answer, index) => {
        return answer === questions[index]?.correctAnswer ? count + 1 : count;
      }, 0);
      
      const score = Math.round((correctAnswers / questions.length) * 100);
      
      const analysisData = {
        questions: questions.map((q, index) => ({
          question: q.question,
          topic: q.topic,
          userAnswer: userAnswers[index],
          correctAnswer: q.correctAnswer,
          isCorrect: userAnswers[index] === q.correctAnswer
        })),
        subject: activeSubject,
        score,
        timeSpent,
        currentWeek,
        studyPlan: studyPlan.exam_type,
        uploadedContent: uploadedContent.substring(0, 1000)
      };

      const aiAnalysis = await AIService.analyzeWeeklyPerformance(analysisData);
      
      let analysis;
      try {
        const firstBrace = aiAnalysis.indexOf('{');
        const lastBrace = aiAnalysis.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1) {
          const jsonString = aiAnalysis.substring(firstBrace, lastBrace + 1);
          analysis = JSON.parse(jsonString);
        } else {
          throw new Error('No valid JSON found');
        }
      } catch (parseError) {
        analysis = {
          strongAreas: score >= 70 ? ['Good conceptual understanding'] : [],
          weakAreas: score < 70 ? ['Needs more practice'] : [],
          recommendations: ['Continue with current approach', 'Focus on weak areas'],
          nextSteps: ['Proceed to next week', 'Review weak topics'],
          weeklyGuidance: `Week ${currentWeek} performance: ${score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs improvement'}`
        };
      }

      const weeklyTest: WeeklyTest = {
        id: Date.now().toString(),
        week: currentWeek,
        subject: activeSubject,
        fileName: fileName,
        fileContent: uploadedContent,
        score,
        completedAt: new Date().toISOString(),
        questions: questions,
        userAnswers: userAnswers,
        totalQuestions: questions.length,
        correctAnswers,
        timeSpent,
        analysis: {
          strongAreas: analysis.strongAreas || [],
          weakAreas: analysis.weakAreas || [],
          recommendations: analysis.recommendations || [],
          nextSteps: analysis.nextSteps || [],
          weeklyGuidance: analysis.weeklyGuidance || ''
        }
      };

      const { data: savedAssessment, error: saveError } = await supabase
        .from('weekly_assessments')
        .insert({
          user_id: user.id,
          study_plan_id: studyPlan?.id,
          week_number: currentWeek,
          subject: activeSubject,
          file_name: fileName,
          score: score,
          strong_areas: weeklyTest.analysis.strongAreas,
          weak_areas: weeklyTest.analysis.weakAreas,
          recommendations: weeklyTest.analysis.recommendations,
          next_steps: weeklyTest.analysis.nextSteps,
          weekly_guidance: weeklyTest.analysis.weeklyGuidance,
          completed_at: weeklyTest.completedAt,
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving weekly assessment:', saveError);
        alert('Error saving weekly assessment. Please try again.');
        return;
      }

      setFetchedWeeklyAssessments(prev => [savedAssessment, ...prev]);
      
      setWeeklyAssessments(prev => ({
        ...prev,
        [currentWeek]: prev[currentWeek]?.map(assessment => 
          assessment.subject === activeSubject 
            ? { 
                ...assessment, 
                completed: true, 
                score, 
                fileName: fileName,
                completedAt: new Date().toISOString()
              }
            : assessment
        ) || []
      }));
      
      setTestResult({
        ...weeklyTest,
        totalQuestions: questions.length,
        correctAnswers,
        timeSpent,
        weeklyGuidance: analysis.weeklyGuidance || ''
      });

      await addStudySession({
        user_id: user.id,
        subject: activeSubject,
        duration_minutes: timeSpent,
        topics_covered: [...new Set(questions.map(q => q.topic))],
        performance_score: Math.max(1, Math.ceil(score / 10)),
      });

      setShowTestInterface(false);

    } catch (error) {
      console.error('Error analyzing weekly test:', error);
      alert('Error analyzing test results. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetTest = () => {
    setShowTestInterface(false);
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setTestResult(null);
    setTestStartTime(null);
    setActiveSubject('');
    setUploadingSubject('');
    setUploadedContent('');
    setFileName('');
  };

  const getWeekStatus = (week: number) => {
    const weekAssessments = weeklyAssessments[week] || [];
    const completedCount = weekAssessments.filter(a => a.completed).length;
    const totalCount = weekAssessments.length;
    
    if (completedCount === totalCount && totalCount > 0) {
      const avgScore = weekAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / completedCount;
      return avgScore >= 70 ? 'completed' : 'needs-improvement';
    } else if (completedCount > 0) {
      return 'partial';
    }
    
    return week === currentWeek ? 'current' : week < currentWeek ? 'missed' : 'upcoming';
  };

  const getWeekProgress = (week: number) => {
    const weekAssessments = weeklyAssessments[week] || [];
    const completedCount = weekAssessments.filter(a => a.completed).length;
    const totalCount = weekAssessments.length;
    return { completed: completedCount, total: totalCount };
  };

  const getWeekSubjects = (week: number) => {
    if (!studyPlan) return [];
    
    const subjectsPerWeek = Math.ceil(studyPlan.subjects.length / studyPlan.total_duration_weeks);
    const startIndex = ((week - 1) * subjectsPerWeek) % studyPlan.subjects.length;
    
    return studyPlan.subjects.slice(startIndex, startIndex + Math.min(subjectsPerWeek, studyPlan.subjects.length - startIndex));
  };

  const startSubjectAssessment = (subject: string) => {
    setUploadingSubject(subject);
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return Crown;
      case 'needs-improvement': return AlertCircle;
      case 'current': return Target;
      case 'partial': return Clock;
      case 'missed': return X;
      default: return Calendar;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'from-yellow-400 to-orange-500';
      case 'needs-improvement': return 'from-orange-400 to-red-500';
      case 'current': return 'from-blue-400 to-indigo-600';
      case 'partial': return 'from-green-400 to-emerald-500';
      case 'missed': return 'from-red-400 to-pink-500';
      default: return 'from-slate-400 to-gray-500';
    }
  };

  if (!studyPlan) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">No Study Plan Found</h2>
          <p className="text-slate-600 mb-8 text-lg">
            Create your personalized study plan to start tracking weekly progress with AI-powered assessments.
          </p>
          <button
            onClick={() => navigate('/enhanced-schedule')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Study Plan</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Test Interface (Enhanced)
  if (showTestInterface && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Enhanced Test Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-3 rounded-3xl text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-7 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Brain className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl max-text-xl font-bold">Week {currentWeek} Assessment</h2>
                  <p className="text-purple-100 max-text-sm text-lg">Content-based evaluation for {activeSubject}</p>
                </div>
              </div>
              <div className="text-left">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                  <p className="text-purple-100 text-xs">Question {currentQuestionIndex + 1} of {questions.length}</p>
                  <p className="text-white font-bold text-sm">{activeSubject}</p>
                  <p className="text-purple-200 text-xs mt-1">{fileName}</p>
                </div>
              </div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="relative">
              <div className="w-full bg-purple-400/30 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-white to-purple-100 h-2 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                  style={{ width: `${progress}%` }}
                >
                  <span className="text-purple-600 text-xs font-bold">{Math.round(progress)}%</span>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center">
                <Sparkles className="w-4 h-4 text-white animate-ping" style={{ 
                  left: `${progress}%`,
                  transform: 'translateX(-50%)'
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Question Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-4 py-3 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                <span className="text-sm font-bold text-slate-800">{currentQuestion.topic}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold">
                  Question {currentQuestionIndex + 1}
                </div>
                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
                  Content-Based
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-lg font-bold text-slate-800 leading-relaxed mb-6">
              {currentQuestion.question}
            </h3>

            {/* Enhanced Options */}
            <div className="space-y-2">
              {currentQuestion.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                    userAnswers[currentQuestionIndex] === index
                      ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-800 shadow-lg scale-105'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:scale-102'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold transition-all duration-300 ${
                      userAnswers[currentQuestionIndex] === index
                        ? 'border-indigo-500 bg-indigo-500 text-white'
                        : 'border-slate-300 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1 font-medium">{option}</span>
                    {userAnswers[currentQuestionIndex] === index && (
                      <CheckCircle className="w-6 h-6 text-indigo-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2 max-[350px]:px-3 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-2xl font-semibold hover:bg-slate-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className='max-text-sm'>Previous</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="text-center">
              <div className="text-sm dark:text-slate-200 text-slate-600 mb-1">Progress</div>
              <div className="text-lg font-bold dark:text-green-400 text-slate-800 max-text-sm">
                {userAnswers.filter(a => a !== -1).length} / {questions.length}
              </div>
            </div>
            <div className="w-px h-8 bg-slate-300"></div>
            <div className="text-center">
              <div className="text-sm dark:text-slate-200 text-slate-600 mb-1">Time</div>
              <div className="text-lg font-bold dark:text-slate-400 text-slate-800 max-text-sm">
                {testStartTime ? Math.floor((Date.now() - testStartTime.getTime()) / 1000 / 60) : 0}m
              </div>
            </div>
          </div>
          
          <button
            onClick={handleNextQuestion}
            disabled={userAnswers[currentQuestionIndex] === -1}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white max-px-4 px-6 py-3 rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className='max-text-sm'>{currentQuestionIndex === questions.length - 1 ? 'Finish Assessment' : 'Next'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Analysis Loading Modal */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md mx-4">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
                <Brain className="w-8 h-8 text-purple-600 absolute top-4 left-1/2 transform -translate-x-1/2" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">AI is Analyzing Your Performance</h3>
              <p className="text-slate-600 mb-4">
                Generating detailed insights and personalized recommendations...
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Performance Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Personalized Guidance</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Results View (Enhanced)
  if (testResult) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Enhanced Results Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 p-8 rounded-3xl text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Week {testResult.week} Results</h2>
                <p className="text-green-100 text-lg">
                  AI-powered analysis for {testResult.subject}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold mb-2">{testResult.score}%</div>
                <div className="text-green-100 text-sm">Overall Score</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold mb-2">{testResult.correctAnswers}/{testResult.totalQuestions}</div>
                <div className="text-green-100 text-sm">Correct</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold mb-2">{testResult.timeSpent}m</div>
                <div className="text-green-100 text-sm">Time Spent</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold mb-2">{Math.ceil(testResult.score / 10)}/10</div>
                <div className="text-green-100 text-sm">Performance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Analysis Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-green-800 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Strong Areas</span>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {testResult.analysis.strongAreas.map((area: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-colors">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-slate-700 font-medium flex-1">{area}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-red-800 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Areas for Improvement</span>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {testResult.analysis.weakAreas.map((area: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-red-50 rounded-xl border border-red-200 hover:bg-red-100 transition-colors">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <span className="text-slate-700 font-medium flex-1">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button
            onClick={resetTest}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Take Another Assessment</span>
          </button>
          
          <button
            onClick={() => {
              const nextWeek = Math.min(currentWeek + 1, studyPlan.total_duration_weeks);
              setCurrentWeek(nextWeek);
              initializeWeeklyAssessments(nextWeek);
              resetTest();
            }}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ArrowRight className="w-5 h-5" />
            <span>Proceed to Next Week</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-br dark:from-slate-800 dark:via-gray-800 dark:to-slate-900 from-cyan-800 via-sky-800 to-blue-900 p-5 rounded-3xl text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Weekly Progress Tracker</h2>
              <p className="text-blue-100 text-sm">
                Your weekly assessments for {studyPlan.exam_type} preparation
              </p>
            </div>
          </div>
          
          <div className="grid max-grid-cols-2 grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl max-p-4 p-6 text-center">
              <div className="text-2xl font-bold mb-2">{animatedWeekStats.totalWeeks}</div>
              <div className="text-blue-100 max-text-xs text-sm">Total Weeks</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl max-p-4 p-6 text-center">
              <div className="text-2xl font-bold mb-2">{animatedWeekStats.completedWeeks}</div>
              <div className="text-blue-100 max-text-xs text-sm">Completed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl max-p-4 p-6 text-center">
              <div className="text-2xl font-bold mb-2">{animatedWeekStats.currentProgress}%</div>
              <div className="text-blue-100 max-text-xs text-sm">Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Week Navigation */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-8 py-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-800">Weekly Timeline</h3>
            <div className="text-sm text-slate-600">
              {studyPlan.total_duration_weeks} weeks • {studyPlan.daily_hours}h/day
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            {Array.from({ length: Math.min(8, studyPlan.total_duration_weeks) }, (_, index) => {
              const week = index + 1;
              const status = getWeekStatus(week);
              const subjects = getWeekSubjects(week);
              const StatusIcon = getStatusIcon(status);
              
              return (
                <div
                  key={week}
                  onClick={() => {
                    setCurrentWeek(week);
                    initializeWeeklyAssessments(week);
                  }}
                  className={`relative p-6 rounded-2xl border-2 text-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    week === currentWeek ? 'ring-4 ring-blue-500/20 scale-105' : ''
                  } ${
                    status === 'completed' ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' :
                    status === 'needs-improvement' ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-red-50' :
                    status === 'current' ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50' :
                    status === 'partial' ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' :
                    status === 'missed' ? 'border-red-300 bg-gradient-to-br from-red-50 to-pink-50' :
                    'border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50'
                  }`}
                >
                  {/* Week Badge */}
                  <div className={`absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r ${getStatusColor(status)} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                    {week}
                  </div>

                  {/* Status Icon */}
                  <div className="mb-4">
                    <StatusIcon className={`w-8 h-8 mx-auto ${
                      status === 'completed' ? 'text-yellow-600' :
                      status === 'needs-improvement' ? 'text-orange-600' :
                      status === 'current' ? 'text-blue-600' :
                      status === 'partial' ? 'text-green-600' :
                      status === 'missed' ? 'text-red-600' :
                      'text-slate-400'
                    }`} />
                  </div>

                  {/* Subjects */}
                  <div className="space-y-1 mb-4">
                    {subjects.slice(0, 2).map((subject, idx) => (
                      <div key={idx} className="text-xs text-slate-600 truncate font-medium">
                        {subject}
                      </div>
                    ))}
                    {subjects.length > 2 && (
                      <div className="text-xs text-slate-500">+{subjects.length - 2} more</div>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="text-xs text-slate-500">
                    {getWeekProgress(week).completed}/{getWeekProgress(week).total} completed
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Current Week Assessments */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Week {currentWeek} Assessments</h3>
              <p className="text-slate-600 mt-1">
                Upload study materials for AI-powered content-specific assessments
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">
                {getWeekProgress(currentWeek).completed}/{getWeekProgress(currentWeek).total}
              </div>
              <div className="text-sm text-slate-500">Subjects Completed</div>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(weeklyAssessments[currentWeek] || []).map((assessment, index) => (
              <div
                key={assessment.subject}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  assessment.completed
                    ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
                    : uploadingSubject === assessment.subject
                    ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50'
                    : 'border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50 hover:border-slate-300'
                }`}
              >
                {/* Subject Icon */}
                <div className="absolute -top-3 -right-3">
                  {assessment.completed ? (
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  ) : uploadingSubject === assessment.subject ? (
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-slate-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-bold text-slate-800 mb-2">{assessment.subject}</h4>
                  {assessment.completed ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Score:</span>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                          (assessment.score || 0) >= 80 ? 'bg-green-100 text-green-800' :
                          (assessment.score || 0) >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {assessment.score}%
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">
                        📄 {assessment.fileName}
                      </div>
                      <div className="text-xs text-slate-500">
                        ✅ {new Date(assessment.completedAt!).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-600 text-sm">
                      Upload study material to generate content-specific questions
                    </p>
                  )}
                </div>

                {!assessment.completed && (
                  <button
                    onClick={() => startSubjectAssessment(assessment.subject)}
                    disabled={uploadingSubject && uploadingSubject !== assessment.subject}
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    {uploadingSubject === assessment.subject ? (
                      <>
                        <Target className="w-5 h-5" />
                        <span>Selected</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span>Start Assessment</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Upload Section */}
      <div id="upload-section" className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-6 border-b border-slate-200">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <Upload className="w-6 h-6 text-purple-600" />
            <span>Upload Content for Assessment</span>
          </h3>
        </div>
        
        <div className="p-8 max-p-6">
          {uploadingSubject && (
            <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-800 font-bold text-lg">📚 Selected: {uploadingSubject}</p>
                  <p className="text-purple-600 text-sm mt-1">
                    {initialTopic 
                      ? `Upload material related to "${initialTopic}" for topic-specific questions`
                      : 'Upload study material to generate content-specific questions'
                    }
                  </p>
                  {initialTopic && (
                    <div className="mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium inline-block">
                      🎯 Focus: {initialTopic}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setUploadingSubject('')}
                  className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-purple-600" />
                </button>
              </div>
            </div>
          )}

          {!uploadingSubject && (
            <div className="mb-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="text-yellow-800 font-bold">Select a subject to begin assessment</p>
                  <p className="text-yellow-600 text-sm">Choose from the subject cards above to upload content</p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced File Upload */}
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-3xl max-py-5 max-px-2 p-12 text-center transition-all duration-300 cursor-pointer ${
              !uploadingSubject
                ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-50'
                : isDragActive 
                ? 'border-purple-400 bg-purple-50 scale-105 shadow-lg' 
                : 'border-slate-300 hover:border-purple-400 hover:bg-slate-50 hover:shadow-lg'
            }`}
          >
            <input {...getInputProps()} disabled={!uploadingSubject} />
            
            {isUploading ? (
              <div className="space-y-4">
                <div className="relative mx-auto w-16 h-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
                  <Brain className="w-8 h-8 text-purple-600 absolute top-4 left-4" />
                </div>
                <div>
                  <p className="text-purple-600 font-bold text-lg">AI is analyzing your content...</p>
                  <p className="text-purple-500 text-sm">Extracting knowledge and generating questions</p>
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm text-purple-500">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Content Extraction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4" />
                    <span>Question Generation</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto">
                  <Upload className="w-10 h-10 text-purple-600" />
                </div>
                <div>
                  <p className="text-slate-700 font-bold text-xl mb-2">
                    {!uploadingSubject 
                      ? 'Select a subject first to upload content'
                      : isDragActive 
                      ? '✨ Drop your study material here...' 
                      : '📚 Upload study material for AI assessment'
                    }
                  </p>
                  <p className="text-slate-500">
                    PDF, DOC, DOCX, TXT • Max 10MB • Content will be extracted automatically
                  </p>
                  {uploadingSubject && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <p className="text-blue-800 font-medium text-sm">
                        🤖 AI will generate {uploadingSubject}-specific questions from your uploaded content
                        {initialTopic && ` focusing on "${initialTopic}"`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {fileName && uploadingSubject && (
            <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-green-800 font-bold">✅ Content uploaded: {fileName}</p>
                  <p className="text-green-600 text-sm">
                    {fileName.toLowerCase().endsWith('.pdf') ? 'PDF content extracted successfully • ' : ''}
                    Ready to generate {uploadingSubject} assessment
                    {initialTopic && ` for "${initialTopic}"`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Assessment History */}
      {fetchedWeeklyAssessments.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-8 py-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-slate-600" />
                <span>Assessment History</span>
              </h3>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-slate-600 font-medium">{fetchedWeeklyAssessments.length} completed</span>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="space-y-4">
              {fetchedWeeklyAssessments.map((test) => (
                <div key={test.id} className="group flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border border-slate-200 hover:shadow-lg hover:from-slate-100 hover:to-gray-100 transition-all duration-300">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getStatusColor(test.score >= 70 ? 'completed' : 'needs-improvement')} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        W{test.week_number}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{test.subject}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-bold text-slate-800 text-lg">{test.score}% Score</h4>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          test.score >= 80 ? 'bg-green-100 text-green-800' :
                          test.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {test.score >= 80 ? 'Excellent' : test.score >= 60 ? 'Good' : 'Needs Work'}
                        </div>
                      </div>
                      <div className="text-sm text-slate-600">
                        📄 {test.file_name} • 📅 {new Date(test.completed_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="max-flex-col justify-center flex items-center space-x-3">
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors group-hover:scale-110">
                      <Eye className="w-5 h-5 text-slate-600 ml-2" />
                    </button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors group-hover:scale-110">
                      <Download className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Week Navigation */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="max-px-2 max-py-4 p-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                const prevWeek = Math.max(1, currentWeek - 1);
                setCurrentWeek(prevWeek);
                initializeWeeklyAssessments(prevWeek);
              }}
              disabled={currentWeek <= 1}
              className="max-px-2 max-py-1 flex items-center space-x-2 bg-gradient-to-r from-slate-500 to-gray-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-slate-600 hover:to-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="max-text-xs">Previous Week</span>
            </button>
            
            <div className="text-center">
              <div className="max-text-lg text-3xl font-bold text-slate-800 mb-2">Week {currentWeek}</div>
              <div className="max-text-xs text-slate-600">
                {getWeekProgress(currentWeek).completed} of {getWeekProgress(currentWeek).total} subjects completed
              </div>
              <div className="mt-2 max-w-24 w-32 bg-slate-200 rounded-full h-2 mx-auto">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(getWeekProgress(currentWeek).completed / Math.max(getWeekProgress(currentWeek).total, 1)) * 100}%` }}
                />
              </div>
            </div>
            
            <button
              onClick={() => {
                const nextWeek = Math.min(studyPlan.total_duration_weeks, currentWeek + 1);
                setCurrentWeek(nextWeek);
                initializeWeeklyAssessments(nextWeek);
              }}
              disabled={currentWeek >= studyPlan.total_duration_weeks}
              className="max-px-3 max-py-1 flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="max-text-xs">Next Week</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlanTracker;