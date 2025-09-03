import React, { useState, useEffect } from 'react';
import { Brain, FileText, Clock, CheckCircle, AlertCircle, TrendingUp, BookOpen, Target } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { AIService } from '../../lib/mistralAI';
import { PDFParser } from '../../lib/pdfParser';
import { safeParseJSON } from '../../utils/jsonParser';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { useDetailedSchedule } from '../../hooks/useDetailedSchedule';
import { supabase } from '../../lib/supabase';


interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
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

const AITestSession: React.FC = () => {
  const { user } = useAuth();
  const { detailedSchedule, loading: detailedScheduleLoading } = useDetailedSchedule(user?.id);
  const { addStudySession } = useProgress(user?.id, detailedSchedule, detailedScheduleLoading);
  
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

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'History', 'Geography', 'Economics', 'Political Science',
    'English', 'Current Affairs', 'Reasoning', 'General Knowledge'
  ];

  const onDrop = async (acceptedFiles: File[]) => {
    if (!selectedSubject) {
      alert('Please select a subject first.');
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    setIsGeneratingTest(true);
    setFileName(file.name);

    try {
      // Use proper PDF parsing
      const content = await PDFParser.extractTextFromFile(file);
      
      // Validate extracted content
      if (!PDFParser.validateFileContent(content)) {
        throw new Error('The file content could not be properly extracted or appears to be corrupted. Please try a different file.');
      }
      
      setUploadedContent(content);
      
      // Generate test questions using AI with actual content
      const testQuestions = await AIService.generateTestQuestions(content, selectedSubject);
      
      // Use robust JSON parsing
      const parsedResponse = safeParseJSON<{ questions: Question[] }>(testQuestions);
      
      let parsedQuestions: Question[];
      
      if (parsedResponse && parsedResponse.questions && Array.isArray(parsedResponse.questions)) {
        parsedQuestions = parsedResponse.questions;
      } else {
        console.warn('Failed to parse AI questions, using content-based fallback');
        // Create content-based fallback questions
        const contentLines = content.split('\n').filter(line => line.trim().length > 20);
        const keyTerms = content.toLowerCase().match(/\b[a-z]{4,}\b/g)?.slice(0, 10) || [];
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
        
        parsedQuestions = [
          {
            id: '1',
            question: `Based on the extracted ${selectedSubject} content from the PDF, what is the main topic discussed?`,
            options: [
              sentences[0]?.substring(0, 60) + '...' || 'Primary concept from extracted content',
              sentences[1]?.substring(0, 60) + '...' || 'Alternative interpretation',
              'General theoretical approach',
              'General overview'
            ],
            correctAnswer: 0,
            explanation: 'This is the main focus based on the extracted PDF content.',
            topic: 'PDF Content Analysis'
          },
          {
            id: '2',
            question: keyTerms.length > 0 ? 
              `The extracted PDF content mentions "${keyTerms[0]}" in the context of:` :
              `According to the extracted material, what approach is emphasized?`,
            options: [
              sentences[2]?.substring(0, 60) + '...' || 'Content-specific approach from PDF',
              'Alternative method',
              'Different strategy',
              'General technique'
            ],
            correctAnswer: 1,
            explanation: 'This approach is emphasized in the extracted PDF material.',
            topic: 'PDF Content Understanding'
          },
          {
            id: '3',
            question: `What key concept does the PDF content explain?`,
            options: [
              sentences[3]?.substring(0, 60) + '...' || 'Key concept from PDF',
              'Basic introductory information',
              'Advanced theoretical framework',
              'General background knowledge'
            ],
            correctAnswer: 0,
            explanation: 'This key concept is explained in the extracted PDF content.',
            topic: 'Key Concepts from PDF'
          }
        ];
      }

      setQuestions(parsedQuestions);
      setUserAnswers(new Array(parsedQuestions.length).fill(-1));
      setTestPhase('test');
      setTestStartTime(new Date());
      
    } catch (error) {
      console.error('Error processing file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error processing the file. Please try again.';
      alert(errorMessage);
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
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishTest = async () => {
    if (!testStartTime || !user) return;

    setIsAnalyzing(true);
    const timeSpent = Math.floor((new Date().getTime() - testStartTime.getTime()) / 1000 / 60);
    
    try {
      // // Calculate basic results
      // const correctAnswers = userAnswers.reduce((count, answer, index) => {
      //   return answer === questions[index]?.correctAnswer ? count + 1 : count;
      // }, 0);
      
      // const score = Math.round((correctAnswers / questions.length) * 100);

      // Calculate basic results
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
      
      // Get detailed analysis from AI
      const analysisData = {
        questions: questions.map((q, index) => ({
          question: q.question,
          topic: q.topic,
          userAnswer: userAnswers[index],
          correctAnswer: q.correctAnswer,
          isCorrect: userAnswers[index] === q.correctAnswer
        })),
        subject: selectedSubject,
        uploadedContent: uploadedContent.substring(0, 2000), // First 2000 chars
        score: scorePercentage,
        timeSpent
      };

      const aiAnalysis = await AIService.analyzeTestPerformance(analysisData);
      
      // Use robust JSON parsing for analysis
      const analysis = safeParseJSON<{
        strongAreas: string[];
        weakAreas: string[];
        detailedAnalysis: string;
        recommendations: string[];
        nextSteps: string[];
      }>(aiAnalysis);

      let finalStrongAreas = analysis?.strongAreas || (scorePercentage >= 70 ? ['Good understanding of core concepts'] : []);
      let finalWeakAreas = analysis?.weakAreas || (scorePercentage < 70 ? ['Needs improvement in fundamental concepts'] : []);
      let finalDetailedAnalysis = analysis?.detailedAnalysis || `You scored ${scorePercentage}% on this ${selectedSubject} test. ${scorePercentage >= 70 ? 'Good performance!' : 'There is room for improvement.'}`;
      let finalRecommendations = analysis?.recommendations || ['Review the uploaded material', 'Practice more questions', 'Focus on weak areas'];
      let finalNextSteps = analysis?.nextSteps || ['Continue with next topic', 'Take more practice tests'];

      
      
      // if (!analysis) {
      //   console.warn('Failed to parse AI analysis, using fallback');
      //   // Fallback analysis
      //   const fallbackAnalysis = {
      //     strongAreas: score >= 70 ? ['Good understanding of core concepts'] : [],
      //     weakAreas: score < 70 ? ['Needs improvement in fundamental concepts'] : [],
      //     detailedAnalysis: `You scored ${score}% on this ${selectedSubject} test. ${score >= 70 ? 'Good performance!' : 'There is room for improvement.'}`,
      //     recommendations: ['Review the uploaded material', 'Practice more questions', 'Focus on weak areas'],
      //     nextSteps: ['Continue with next topic', 'Take more practice tests']
      //   };

      
        const result: TestResult = {
          score: scorePercentage,
          totalQuestions: questions.length,
          correctAnswers,
          timeSpent,
          // strongAreas: fallbackAnalysis.strongAreas,
          // weakAreas: fallbackAnalysis.weakAreas,
          // detailedAnalysis: fallbackAnalysis.detailedAnalysis,
          // recommendations: fallbackAnalysis.recommendations,
          // nextSteps: fallbackAnalysis.nextSteps,
          strongAreas: finalStrongAreas,
        weakAreas: finalWeakAreas,
        detailedAnalysis: finalDetailedAnalysis,
        recommendations: finalRecommendations,
        nextSteps: finalNextSteps,
        questions: questions,
        userAnswers: userAnswers
        };
        
        setTestResult(result);
        setTestPhase('results');

      // Save to quiz_attempts table (NEW)
      const { data: quizAttemptData, error: quizAttemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          subject: selectedSubject,
          topic: questions[0]?.topic || 'General', // Use first question's topic or general
          score_percentage: scorePercentage,
          time_taken_minutes: timeSpent,
          total_questions: questions.length,
          correct_answers: correctAnswers,
          weak_concepts: Array.from(new Set(weakConcepts)), // Ensure unique
          strong_concepts: Array.from(new Set(strongConcepts)), // Ensure unique
          attempt_details: analysisData, // Store full data for reference
        })
        .select()
        .single();

      if (quizAttemptError) {
        console.error('Error saving quiz attempt:', quizAttemptError);
        alert('Error saving detailed quiz attempt. Please check console.');
      }
        
        // Save high-level summary to study_sessions (existing)
      await addStudySession({
        user_id: user.id,
        subject: selectedSubject,
        duration_minutes: timeSpent,
        topics_covered: Array.from(new Set(questions.map(q => q.topic))),
        performance_score: Math.max(1, Math.ceil(scorePercentage / 10)), // Convert percentage to 1-10 scale
      });


    } catch (error) {
      console.error('Error analyzing test:', error);
      alert('Error analyzing test results. Please try again.');
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
  };

  if (testPhase === 'results' && testResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span>AI Recommendations</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
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
                          <div className="flex items-center justify-between">
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
    </div>
  );
};

export default AITestSession;