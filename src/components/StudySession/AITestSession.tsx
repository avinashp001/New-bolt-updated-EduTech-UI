import React, { useState, useEffect } from 'react';
import { Brain, FileText, Clock, CheckCircle, AlertCircle, TrendingUp, BookOpen, Target } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { AIService } from '../../lib/mistralAI';
import { PDFParser } from '../../lib/pdfParser';
// import { safeParseJSON } from '../../utils/jsonParser'; // not used now
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { useDetailedSchedule } from '../../hooks/useDetailedSchedule';
import { supabase } from '../../lib/supabase';
import RetryPopup from '../Common/RetryPopup';
import { useQuizMode } from '../../context/QuizModeContext';
import { parseFirstJSONCandidate } from '../../utils/jsonParser';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
  topic: string;
}

interface TestResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  strongAreas: string[];
  weakAreas: string[];
  detailedAnalysis: string;
  recommendations: string[];
  nextSteps: string[];
  questions: Question[];
  userAnswers: number[];
}

// --- Normalizers / Helpers ---
const toFourOptions = (raw: any): string[] => {
  let opts: string[] = [];
  if (Array.isArray(raw)) opts = raw.map(String);
  else if (raw && typeof raw === 'object') {
    // sometimes comes as {A: "...", B: "...", ...}
    const keys = Object.keys(raw).sort(); // A,B,C,D...
    opts = keys.map(k => String(raw[k]));
  }
  // ensure 4 options
  const padded = [...opts].slice(0, 4);
  while (padded.length < 4) padded.push('None of the above');
  return padded;
};

const letterToIndex = (val: string): number | null => {
  const v = val.trim().toUpperCase();
  if (['A', 'B', 'C', 'D'].includes(v)) return v.charCodeAt(0) - 65;
  return null;
};

const guessCorrectIndex = (q: any, opts: string[]): number => {
  // Try number (0- or 1-based)
  if (typeof q.correctAnswer === 'number') {
    return q.correctAnswer >= 1 ? q.correctAnswer - 1 : q.correctAnswer;
  }
  // Try letter A-D
  if (typeof q.correctAnswer === 'string') {
    // sometimes it's the text of the option
    const byLetter = letterToIndex(q.correctAnswer);
    if (byLetter !== null) return Math.min(Math.max(byLetter, 0), 3);

    const textIdx = opts.findIndex(o => o.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase());
    if (textIdx !== -1) return textIdx;
  }
  if (typeof q.answer === 'number') return q.answer >= 1 ? q.answer - 1 : q.answer;
  if (typeof q.answer === 'string') {
    const byLetter = letterToIndex(q.answer);
    if (byLetter !== null) return Math.min(Math.max(byLetter, 0), 3);
    const textIdx = opts.findIndex(o => o.trim().toLowerCase() === q.answer.trim().toLowerCase());
    if (textIdx !== -1) return textIdx;
  }
  // Default to first
  return 0;
};

const normalizeQuestions = (raw: any, selectedSubject: string): Question[] => {
  const list: any[] = Array.isArray(raw) ? raw : raw?.questions || raw?.data || [];
  return list
    .map((q, idx) => {
      const options = toFourOptions(q.options ?? q.choices ?? q.answers);
      const correctAnswer = guessCorrectIndex(q, options);
      const text =
        q.question || q.q || q.prompt || q.text || `Question ${idx + 1}`;
      const topic =
        q.topic || q.chapter || q.subtopic || selectedSubject || 'General';
      const explanation =
        q.explanation || q.explain || q.why || 'Review the concept.';
      return {
        id: String(q.id ?? idx + 1),
        question: String(text),
        options,
        correctAnswer: Math.min(Math.max(correctAnswer, 0), options.length - 1),
        explanation: String(explanation),
        topic: String(topic),
      } as Question;
    })
    .filter(q => q.question && q.options?.length >= 2);
};

const buildTinyFallback = (content: string, selectedSubject: string): Question[] => {
  const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const first = sentences[0]?.slice(0, 80) || 'Core idea from your material';
  return [
    {
      id: '1',
      question: `What is a key idea from your ${selectedSubject} material?`,
      options: [first, 'Background detail', 'Irrelevant fact', 'Random guess'],
      correctAnswer: 0,
      explanation: 'This captures the main idea from the uploaded content.',
      topic: selectedSubject || 'General',
    },
    {
      id: '2',
      question: 'Which option best aligns with the central theme?',
      options: ['Central theme', 'Peripheral note', 'Outlier detail', 'Contradiction'],
      correctAnswer: 0,
      explanation: 'Focus on the central theme discussed.',
      topic: selectedSubject || 'General',
    },
    {
      id: '3',
      question: 'Identify the most accurate statement based on the content.',
      options: ['Accurate statement', 'Partially true', 'Misleading', 'Incorrect'],
      correctAnswer: 0,
      explanation: 'Accuracy is prioritized.',
      topic: selectedSubject || 'General',
    },
  ];
};

const AITestSession: React.FC = () => {
  const { user } = useAuth();
  const { detailedSchedule, loading: detailedScheduleLoading } = useDetailedSchedule(user?.id);
  const { addStudySession } = useProgress(user?.id, detailedSchedule, detailedScheduleLoading);
  const { setQuizMode } = useQuizMode();

  const [selectedSubject, setSelectedSubject] = useState('');
  const [uploadedContent, setUploadedContent] = useState<string>('');
  const [fileName, setFileName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [testStartTime, setTestStartTime] = useState<Date | null>(null);
  const [testPhase, setTestPhase] = useState<'upload' | 'test' | 'results'>('upload');

  const [error, setError] = useState<string>('');
  const [showRetryPopup, setShowRetryPopup] = useState(false);

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'History', 'Geography', 'Economics', 'Political Science',
    'English', 'Current Affairs', 'Reasoning', 'General Knowledge'
  ];

  useEffect(() => {
    setQuizMode(testPhase === 'test');
    return () => setQuizMode(false);
  }, [testPhase, setQuizMode]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!selectedSubject) {
      alert('Please select a subject first.');
      return;
    }
    const file = acceptedFiles[0];
    if (!file) return;

    setIsGeneratingTest(true);
    setFileName(file.name);
    setError('');
    setShowRetryPopup(false);

    try {
      // 1) Extract content
      const content = await PDFParser.extractTextFromFile(file);
      if (!PDFParser.validateFileContent(content)) {
        throw new Error('The file content could not be extracted properly. Try another file.');
      }
      setUploadedContent(content);

      // 2) Ask AI to generate questions
      const raw = await AIService.generateTestQuestions(content, selectedSubject);

      // 3) Parse/normalize
      const parsed = parseFirstJSONCandidate<any>(raw);
      let normalized = normalizeQuestions(parsed, selectedSubject);

      // 4) Fallback if parsing produced nothing
      if (!normalized || normalized.length === 0) {
        console.warn('Failed to parse AI questions, using tiny fallback');
        normalized = buildTinyFallback(content, selectedSubject);
      }

      // 5) >>> CRITICAL: move to TEST phase <<<
      setQuestions(normalized);
      setUserAnswers(new Array(normalized.length).fill(-1));
      setTestPhase('test');
      setTestStartTime(new Date());

    } catch (e: any) {
      console.error('Error processing file / generating questions:', e);
      const msg = e?.message || 'Error generating the test. Please try again.';
      setError(msg);
      setShowRetryPopup(true);
    } finally {
      setIsGeneratingTest(false);
    }
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
      finishTest();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const finishTest = async () => {
    if (!testStartTime || !user) return;

    setIsAnalyzing(true);
    const timeSpent = Math.floor((Date.now() - testStartTime.getTime()) / 1000 / 60);

    try {
      let correctAnswers = 0;
      const weakConcepts: string[] = [];
      const strongConcepts: string[] = [];

      questions.forEach((q, index) => {
        if (userAnswers[index] === q.correctAnswer) {
          correctAnswers++;
          strongConcepts.push(q.topic);
        } else {
          weakConcepts.push(q.topic);
        }
      });

      const scorePercentage = Math.round((correctAnswers / questions.length) * 100);

      const analysisData = {
        questions: questions.map((q, index) => ({
          question: q.question,
          topic: q.topic,
          userAnswer: userAnswers[index],
          correctAnswer: q.correctAnswer,
          isCorrect: userAnswers[index] === q.correctAnswer
        })),
        subject: selectedSubject,
        uploadedContent: uploadedContent.substring(0, 2000),
        score: scorePercentage,
        timeSpent
      };

      const aiAnalysisRaw = await AIService.analyzeTestPerformance(analysisData);
      const analysis = parseFirstJSONCandidate<{
        strongAreas: string[];
        weakAreas: string[];
        detailedAnalysis: string;
        recommendations: string[];
        nextSteps: string[];
      }>(aiAnalysisRaw);

      const finalStrongAreas = analysis?.strongAreas || (scorePercentage >= 70 ? ['Good understanding of core concepts'] : []);
      const finalWeakAreas = analysis?.weakAreas || (scorePercentage < 70 ? ['Needs improvement in fundamental concepts'] : []);
      const finalDetailedAnalysis = analysis?.detailedAnalysis || `You scored ${scorePercentage}% on this ${selectedSubject} test. ${scorePercentage >= 70 ? 'Good performance!' : 'There is room for improvement.'}`;
      const finalRecommendations = analysis?.recommendations || ['Review the uploaded material', 'Practice more questions', 'Focus on weak areas'];
      const finalNextSteps = analysis?.nextSteps || ['Continue with next topic', 'Take more practice tests'];

      const result: TestResult = {
        score: scorePercentage,
        totalQuestions: questions.length,
        correctAnswers,
        timeSpent,
        strongAreas: finalStrongAreas,
        weakAreas: finalWeakAreas,
        detailedAnalysis: finalDetailedAnalysis,
        recommendations: finalRecommendations,
        nextSteps: finalNextSteps,
        questions,
        userAnswers
      };

      setTestResult(result);
      setTestPhase('results');

      // persist attempt
      const { error: quizAttemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          subject: selectedSubject,
          topic: questions[0]?.topic || 'General',
          score_percentage: scorePercentage,
          time_taken_minutes: timeSpent,
          total_questions: questions.length,
          correct_answers: correctAnswers,
          weak_concepts: Array.from(new Set(weakConcepts)),
          strong_concepts: Array.from(new Set(strongConcepts)),
          attempt_details: analysisData,
        })
        .select()
        .single();

      if (quizAttemptError) {
        console.error('Error saving quiz attempt:', quizAttemptError);
        setError(quizAttemptError.message || 'Failed to save quiz attempt.');
        setShowRetryPopup(true);
      }

      // progress summary
      await addStudySession({
        user_id: user.id,
        subject: selectedSubject,
        duration_minutes: timeSpent,
        topics_covered: Array.from(new Set(questions.map(q => q.topic))),
        performance_score: Math.max(1, Math.ceil(scorePercentage / 10)),
      });
    } catch (e: any) {
      console.error('Error analyzing test:', e);
      setError(e?.message || 'Error analyzing test results. Please try again.');
      setShowRetryPopup(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetTest = () => {
    setTestPhase('upload');
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setTestResult(null);
    setUploadedContent('');
    setFileName('');
    setTestStartTime(null);
    setError('');
    setShowRetryPopup(false);
  };

  if (testPhase === 'results' && testResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-3">
        {/* Results Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-2xl text-white">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Test Results & AI Analysis</h2>
          </div>
          <p className="text-green-100">
            Upload your study material (PDF, DOC, TXT) and let AI extract content to generate a personalized test for performance analysis
          </p>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{testResult.score}%</div>
            <p className="text-slate-600">Overall Score</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {testResult.correctAnswers}/{testResult.totalQuestions}
            </div>
            <p className="text-slate-600">Correct Answers</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{testResult.timeSpent}m</div>
            <p className="text-slate-600">Time Spent</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {Math.ceil(testResult.score / 10)}/10
            </div>
            <p className="text-slate-600">Performance Score</p>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span>AI Performance Analysis</span>
          </h3>
          <div className="prose max-w-none">
            <p className="text-slate-700 leading-relaxed">{testResult.detailedAnalysis}</p>
          </div>
        </div>

        {/* Strong & Weak Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Strong Areas</span>
            </h3>
            <div className="space-y-2">
              {testResult.strongAreas.map((area, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700">{area}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>Areas for Improvement</span>
            </h3>
            <div className="space-y-2">
              {testResult.weakAreas.map((area, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-slate-700">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="max-p-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="max-ml-2 text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span>AI Recommendations</span>
          </h3>
          <div className="max-ml-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-700 mb-3">Study Recommendations</h4>
              <ul className="space-y-2">
                {testResult.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-700 mb-3">Next Steps</h4>
              <ul className="space-y-2">
                {testResult.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
                  {/* Detailed Question Review */}
        <div className="max-p-2 mt-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Question-by-Question Review</span>
          </h3>
          
          <div className="space-y-6">
            {testResult.questions.map((question, index) => {
              const userAnswer = testResult.userAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className={`p-6 rounded-lg border-2 ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        isCorrect ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">{question.topic}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-800 leading-relaxed">
                      {question.question}
                    </h4>
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-3 mb-4">
                    {question.options.map((option, optionIndex) => {
                      const isUserAnswer = userAnswer === optionIndex;
                      const isCorrectAnswer = question.correctAnswer === optionIndex;
                      
                      let optionClass = 'border-slate-200 bg-white';
                      let textClass = 'text-slate-700';
                      let iconElement = null;
                      
                      if (isCorrectAnswer) {
                        optionClass = 'border-green-500 bg-green-100';
                        textClass = 'text-green-800';
                        iconElement = <CheckCircle className="w-5 h-5 text-green-600" />;
                      } else if (isUserAnswer && !isCorrect) {
                        optionClass = 'border-red-500 bg-red-100';
                        textClass = 'text-red-800';
                        iconElement = <AlertCircle className="w-5 h-5 text-red-600" />;
                      }
                      
                      return (
                        <div
                          key={optionIndex}
                          className={`p-4 rounded-lg border-2 ${optionClass} transition-all`}
                        >
                          <div className="max-flex-col flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <span className={`font-medium ${textClass}`}>
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              <span className={`${textClass} flex-1`}>{option}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {isUserAnswer && (
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                }`}>
                                  Your Answer
                                </span>
                              )}
                              {isCorrectAnswer && (
                                <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-medium">
                                  Correct Answer
                                </span>
                              )}
                              {iconElement}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className={`p-4 rounded-lg ${
                    isCorrect ? 'bg-green-100 border border-green-200' : 'bg-blue-100 border border-blue-200'
                  }`}>
                    <h5 className={`font-medium mb-2 ${
                      isCorrect ? 'text-green-800' : 'text-blue-800'
                    }`}>
                      Explanation:
                    </h5>
                    <p className={`text-sm ${
                      isCorrect ? 'text-green-700' : 'text-blue-700'
                    }`}>
                      {question.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={resetTest}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Take Another Test
          </button>
        </div>
      </div>
    );
  }

  if (testPhase === 'test' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Test Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8" />
              <h2 className="text-2xl font-bold">AI Generated Test</h2>
            </div>
            <div className="text-right">
              <p className="text-blue-100">Question {currentQuestionIndex + 1} of {questions.length}</p>
              <p className="text-blue-100 text-sm">{selectedSubject}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-blue-400 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">{currentQuestion.topic}</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  userAnswers[currentQuestionIndex] === index
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    userAnswers[currentQuestionIndex] === index
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-slate-300'
                  }`}>
                    {userAnswers[currentQuestionIndex] === index && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={handleNextQuestion}
            disabled={userAnswers[currentQuestionIndex] === -1}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Test' : 'Next'}
          </button>
        </div>

        {isAnalyzing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-800 font-medium">AI is analyzing your performance...</p>
              <p className="text-slate-600 text-sm">This may take a few moments</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-3">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-2xl text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-8 h-8" />
          <h2 className="text-2xl font-bold">AI-Powered Performance Analysis</h2>
        </div>
        <p className="text-purple-100">
          Upload your study material and let AI generate a personalized test to analyze your performance automatically
        </p>
      </div>

      {/* Subject Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Select Subject</h3>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Choose a subject</option>
          {subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      {/* File Upload */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Upload Study Material</h3>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragActive 
              ? 'border-purple-400 bg-purple-50' 
              : 'border-slate-300 hover:border-purple-400 hover:bg-slate-50'
          }`}
        >
          <input {...getInputProps()} />
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          {isGeneratingTest ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              <p className="text-purple-600">AI is generating your personalized test...</p>
            </div>
          ) : (
            <>
              <p className="text-slate-600 mb-2">
                {isDragActive 
                  ? 'Drop your study material here...' 
                  : 'Drag & drop your PDF/study material, or click to browse'
                }
              </p>
              <p className="text-sm text-slate-500">
                Supports PDF, DOC, DOCX, TXT files (Max 10MB) • PDF content will be extracted automatically
              </p>
              {!selectedSubject && (
                <p className="text-sm text-red-500 mt-2">
                  Please select a subject first
                </p>
              )}
            </>
          )}
        </div>

        {fileName && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">File uploaded: {fileName}</p>
            <p className="text-green-600 text-sm">
              {fileName.toLowerCase().endsWith('.pdf') ? 'PDF content extracted successfully • ' : ''}
              AI will generate questions based on the extracted content
            </p>
          </div>
        )}
      </div>

      {/* How it Works */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">How AI Performance Analysis Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-slate-800 mb-2">1. Upload & Extract</h4>
            <p className="text-sm text-slate-600">Upload PDF/study material and AI will extract and analyze the content</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-slate-800 mb-2">2. AI Generates Test</h4>
            <p className="text-sm text-slate-600">AI creates personalized questions based on the extracted content</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-slate-800 mb-2">3. Performance Analysis</h4>
            <p className="text-sm text-slate-600">Get detailed insights, strengths, weaknesses, and guidance</p>
          </div>
        </div>
      </div>
      {showRetryPopup && (
  <RetryPopup
    isOpen={showRetryPopup}
    title="Failed to Generate Quiz"
    message={error} 
    onTryAgain={() => {
      setShowRetryPopup(false);
      resetTest(); // optional: reset to upload phase
    }} 
    onCancel={() => setShowRetryPopup(false)} 
  />
)}

    </div>
  );
};

export default AITestSession;
