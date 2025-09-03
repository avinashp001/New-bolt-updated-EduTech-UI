// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Brain, CheckCircle, AlertCircle, TrendingUp, BookOpen, Target, Clock, Award, ArrowLeft, RotateCcw } from 'lucide-react';
// import { AIService } from '../../lib/mistralAI';
// import { useAuth } from '../../hooks/useAuth';
// import { useProgress } from '../../hooks/useProgress';

// interface Question {
//   id: string;
//   question: string;
//   options: string[];
//   correctAnswer: number;
//   explanation: string;
//   topic: string;
//   difficulty: 'medium' | 'hard';
//   questionType: string;
// }

// interface TestResult {
//   score: number;
//   totalQuestions: number;
//   correctAnswers: number;
//   timeSpent: number;
//   strongAreas: string[];
//   weakAreas: string[];
//   detailedAnalysis: string;
//   recommendations: string[];
//   nextSteps: string[];
//   questions: Question[]; 
//   userAnswers: number[];
//   subject: string;
//   topic: string;
// }

// const TheoryQuizSession: React.FC = () => {
//   const { user } = useAuth();
//   const { addStudySession } = useProgress(user?.id);
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [userAnswers, setUserAnswers] = useState<number[]>([]);
//   const [testResult, setTestResult] = useState<TestResult | null>(null);
//   const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [testStartTime, setTestStartTime] = useState<Date | null>(null);
//   const [testPhase, setTestPhase] = useState<'generating' | 'test' | 'results'>('generating');
//   const [subject, setSubject] = useState('');
//   const [topic, setTopic] = useState('');
//   const [theoryContent, setTheoryContent] = useState('');

//   // Extract data from navigation state
//   useEffect(() => {
//     const state = location.state as any;
//     if (state?.subject && state?.topic && state?.theoryContent) {
//       setSubject(state.subject);
//       setTopic(state.topic);
//       setTheoryContent(state.theoryContent);
//       generateQuizFromContent(state.theoryContent, state.subject, state.topic);
//     } else {
//       // Redirect back if no content provided
//       navigate('/courses', { replace: true });
//     }
//   }, [location.state, navigate]);

//   const generateQuizFromContent = async (content: string, subjectName: string, topicName: string) => {
//     setIsGeneratingQuiz(true);
    
//     try {
//       const testQuestions = await AIService.generateTheoryQuizQuestions(content, subjectName, topicName);
      
//       let parsedQuestions: Question[];
//       try {
//         const firstBrace = testQuestions.indexOf('{');
//         const lastBrace = testQuestions.lastIndexOf('}');
        
//         if (firstBrace !== -1 && lastBrace !== -1) {
//           const jsonString = testQuestions.substring(firstBrace, lastBrace + 1);
//           const parsed = JSON.parse(jsonString);
//           parsedQuestions = parsed.questions || [];
//         } else {
//           throw new Error('No valid JSON found');
//         }
//       } catch (parseError) {
//         console.error('Error parsing AI questions:', parseError);
//         // Enhanced fallback questions based on content
//         parsedQuestions = this.createFallbackQuestions(content, subjectName, topicName);
//       }

//       setQuestions(parsedQuestions);
//       setUserAnswers(new Array(parsedQuestions.length).fill(-1));
//       setTestPhase('test');
//       setTestStartTime(new Date());
      
//     } catch (error) {
//       console.error('Error generating quiz:', error);
//       alert('Error generating quiz. Please try again.');
//       navigate(-1); // Go back to previous page
//     } finally {
//       setIsGeneratingQuiz(false);
//     }
//   };

//   const createFallbackQuestions = (content: string, subjectName: string, topicName: string): Question[] => {
//     const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
//     const keyTerms = content.toLowerCase().match(/\b[a-z]{4,}\b/g)?.slice(0, 10) || [];
//     const hasFormulas = /\$.*\$/.test(content) || /[=+\-*/()0-9]/.test(content);
    
//     return [
//       {
//         id: '1',
//         question: `Analyze the core principles of ${topicName} as presented in the theory. Which statement best demonstrates the interconnection between the key concepts?`,
//         options: [
//           sentences[0]?.substring(0, 80) + '...' || 'The concepts are fundamentally interconnected through shared theoretical foundations',
//           sentences[1]?.substring(0, 80) + '...' || 'Each concept operates independently without significant theoretical overlap',
//           'The relationships are purely mathematical without conceptual significance',
//           'The concepts contradict each other in fundamental ways'
//         ],
//         correctAnswer: 0,
//         explanation: `This demonstrates deep understanding of how the theoretical concepts in ${topicName} work together within the ${subjectName} framework.`,
//         topic: `${topicName} - Conceptual Analysis`,
//         difficulty: 'medium' as const,
//         questionType: 'analysis'
//       },
//       {
//         id: '2',
//         question: hasFormulas ? 
//           `Evaluate the mathematical relationships in ${topicName}. If the given conditions were modified, what would be the most significant impact?` :
//           `Critically assess the theoretical approach in ${topicName}. What would be the primary limitation in complex applications?`,
//         options: [
//           hasFormulas ? 'The mathematical relationships would require complete theoretical recalibration' : 'The theoretical limitations would become more pronounced in complex scenarios',
//           hasFormulas ? 'Only minor numerical adjustments would be needed' : 'The approach would remain equally effective in all scenarios',
//           hasFormulas ? 'The mathematical formulations would become completely invalid' : 'No significant limitations would emerge in practice',
//           hasFormulas ? 'The relationships would reverse their fundamental nature' : 'The approach would become more robust under complexity'
//         ],
//         correctAnswer: 0,
//         explanation: `This requires critical evaluation of the ${topicName} framework and understanding of its theoretical limitations and dependencies.`,
//         topic: `${topicName} - Critical Evaluation`,
//         difficulty: 'hard' as const,
//         questionType: 'evaluation'
//       },
//       {
//         id: '3',
//         question: keyTerms.length > 1 ? 
//           `Compare the roles of "${keyTerms[0]}" and "${keyTerms[1]}" in the ${topicName} framework. What is their most significant functional difference?` :
//           `Analyze the hierarchical structure of concepts in ${topicName}. Which element serves as the foundational basis?`,
//         options: [
//           keyTerms.length > 1 ? `${keyTerms[0]} provides structural foundation while ${keyTerms[1]} enables dynamic functionality` : 'The foundational element establishes the theoretical basis for all subsequent concepts',
//           keyTerms.length > 1 ? `${keyTerms[0]} and ${keyTerms[1]} serve identical functions in different contexts` : 'All elements contribute equally without hierarchical structure',
//           keyTerms.length > 1 ? `${keyTerms[1]} is more fundamental than ${keyTerms[0]} in all applications` : 'The most complex element serves as the foundation',
//           keyTerms.length > 1 ? `Both terms represent the same concept with different terminology` : 'No single element is more foundational than others'
//         ],
//         correctAnswer: 0,
//         explanation: `This requires comparative analysis and understanding of the functional roles of different elements within the ${topicName} theoretical system.`,
//         topic: `${topicName} - Comparative Analysis`,
//         difficulty: 'medium' as const,
//         questionType: 'comparison'
//       }
//     ];
//   };

//   const handleAnswerSelect = (answerIndex: number) => {
//     const newAnswers = [...userAnswers];
//     newAnswers[currentQuestionIndex] = answerIndex;
//     setUserAnswers(newAnswers);
//   };

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       finishQuiz();
//     }
//   };

//   const handlePreviousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const finishQuiz = async () => {
//     if (!testStartTime || !user) return;

//     setIsAnalyzing(true);
//     const timeSpent = Math.floor((new Date().getTime() - testStartTime.getTime()) / 1000 / 60);
    
//     try {
//       // Calculate basic results
//       const correctAnswers = userAnswers.reduce((count, answer, index) => {
//         return answer === questions[index]?.correctAnswer ? count + 1 : count;
//       }, 0);
      
//       const score = Math.round((correctAnswers / questions.length) * 100);
      
//       // Create detailed analysis based on question types and difficulty
//       const questionAnalysis = questions.map((q, index) => ({
//         question: q.question,
//         topic: q.topic,
//         difficulty: q.difficulty,
//         questionType: q.questionType,
//         userAnswer: userAnswers[index],
//         correctAnswer: q.correctAnswer,
//         isCorrect: userAnswers[index] === q.correctAnswer
//       }));

//       // Analyze performance by question type and difficulty
//       const hardQuestions = questionAnalysis.filter(q => q.difficulty === 'hard');
//       const mediumQuestions = questionAnalysis.filter(q => q.difficulty === 'medium');
//       const hardCorrect = hardQuestions.filter(q => q.isCorrect).length;
//       const mediumCorrect = mediumQuestions.filter(q => q.isCorrect).length;

//       const analysisTypes = questionAnalysis.reduce((acc, q) => {
//         if (!acc[q.questionType]) acc[q.questionType] = { correct: 0, total: 0 };
//         acc[q.questionType].total++;
//         if (q.isCorrect) acc[q.questionType].correct++;
//         return acc;
//       }, {} as Record<string, { correct: number; total: number }>);

//       // Generate sophisticated analysis
//       const strongAreas = [];
//       const weakAreas = [];
//       const recommendations = [];
//       const nextSteps = [];

//       // Analyze by question type
//       Object.entries(analysisTypes).forEach(([type, stats]) => {
//         const percentage = (stats.correct / stats.total) * 100;
//         if (percentage >= 70) {
//           strongAreas.push(`${type.charAt(0).toUpperCase() + type.slice(1)} skills in ${topic}`);
//         } else {
//           weakAreas.push(`${type.charAt(0).toUpperCase() + type.slice(1)} abilities in ${topic}`);
//         }
//       });

//       // Analyze by difficulty
//       if (hardQuestions.length > 0) {
//         const hardPercentage = (hardCorrect / hardQuestions.length) * 100;
//         if (hardPercentage >= 60) {
//           strongAreas.push(`Advanced conceptual understanding of ${topic}`);
//         } else {
//           weakAreas.push(`Complex problem-solving in ${topic}`);
//           recommendations.push(`Focus on advanced applications and complex scenarios in ${topic}`);
//         }
//       }

//       if (mediumQuestions.length > 0) {
//         const mediumPercentage = (mediumCorrect / mediumQuestions.length) * 100;
//         if (mediumPercentage >= 70) {
//           strongAreas.push(`Solid grasp of intermediate ${topic} concepts`);
//         } else {
//           weakAreas.push(`Intermediate concept application in ${topic}`);
//           recommendations.push(`Strengthen understanding of core ${topic} principles`);
//         }
//       }

//       // Generate recommendations based on performance
//       if (score >= 85) {
//         recommendations.push(`Excellent mastery of ${topic}! Ready for advanced topics in ${subject}`);
//         recommendations.push(`Consider exploring practical applications and real-world scenarios`);
//         nextSteps.push(`Proceed to next advanced topic in ${subject}`);
//         nextSteps.push(`Take on challenging problem-solving exercises`);
//       } else if (score >= 70) {
//         recommendations.push(`Good understanding of ${topic}. Focus on strengthening weak areas`);
//         recommendations.push(`Practice more complex application problems`);
//         nextSteps.push(`Review challenging concepts before advancing`);
//         nextSteps.push(`Take additional practice quizzes on similar topics`);
//       } else {
//         recommendations.push(`${topic} requires more focused study and practice`);
//         recommendations.push(`Revisit the theory content and create detailed notes`);
//         nextSteps.push(`Re-read the theory content thoroughly`);
//         nextSteps.push(`Seek additional resources for ${topic} in ${subject}`);
//       }

//       const detailedAnalysis = `Your performance on this ${topic} theory-based assessment demonstrates ${
//         score >= 85 ? 'excellent mastery' : 
//         score >= 70 ? 'good understanding' : 
//         score >= 55 ? 'developing comprehension' : 'foundational gaps'
//       } of the content. You completed ${questions.length} sophisticated questions in ${timeSpent} minutes, showing ${
//         timeSpent < 15 ? 'quick analytical thinking' : 
//         timeSpent > 25 ? 'thorough consideration' : 'balanced pacing'
//       }. ${hardQuestions.length > 0 ? `On advanced questions, you achieved ${Math.round((hardCorrect / hardQuestions.length) * 100)}% accuracy. ` : ''}${
//         score >= 70 ? 'Your conceptual understanding is solid and ready for practical applications.' : 'Focus on strengthening theoretical foundations before advancing.'
//       }`;

//       const result: TestResult = {
//         score,
//         totalQuestions: questions.length,
//         correctAnswers,
//         timeSpent,
//         strongAreas,
//         weakAreas,
//         detailedAnalysis,
//         recommendations,
//         nextSteps,
//         questions,
//         userAnswers,
//         subject,
//         topic
//       };

//       setTestResult(result);
//       setTestPhase('results');

//       // Save study session
//       await addStudySession({
//         user_id: user.id,
//         subject: subject,
//         duration_minutes: timeSpent,
//         topics_covered: [topic],
//         performance_score: Math.max(1, Math.ceil(score / 10)), // Convert percentage to 1-10 scale
//       });

//     } catch (error) {
//       console.error('Error analyzing quiz:', error);
//       alert('Error analyzing quiz results. Please try again.');
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const resetQuiz = () => {
//     setTestPhase('generating');
//     setQuestions([]);
//     setUserAnswers([]);
//     setCurrentQuestionIndex(0);
//     setTestResult(null);
//     setTestStartTime(null);
    
//     // Regenerate quiz with same content
//     if (theoryContent && subject && topic) {
//       generateQuizFromContent(theoryContent, subject, topic);
//     }
//   };

//   const handleBackToCourse = () => {
//     navigate(`/courses/${encodeURIComponent(subject)}`, { replace: true });
//   };

//   const handleBackToTheory = () => {
//     navigate(`/courses/${encodeURIComponent(subject)}/theory/${encodeURIComponent(topic)}`, { replace: true });
//   };

//   // Generating Phase
//   if (testPhase === 'generating') {
//     return (
//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 rounded-2xl text-white">
//           <div className="flex items-center space-x-3 mb-4">
//             <Brain className="w-8 h-8" />
//             <h2 className="text-2xl font-bold">AI Theory Assessment</h2>
//           </div>
//           <p className="text-purple-100">
//             Generating sophisticated questions based on your study of "{topic}" in {subject}
//           </p>
//         </div>

//         {/* Loading State */}
//         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
//           <div className="flex flex-col items-center justify-center py-12">
//             <div className="relative mb-6">
//               <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
//               <Brain className="w-8 h-8 text-purple-600 absolute top-4 left-4" />
//             </div>
//             <h3 className="text-xl font-semibold text-slate-800 mb-2">Generating Advanced Assessment</h3>
//             <p className="text-slate-600 text-center max-w-md mb-4">
//               AI is analyzing the theory content you just studied and creating sophisticated, 
//               medium-to-hard level questions to test your understanding of <strong>{topic}</strong>
//             </p>
//             <div className="flex items-center space-x-4 text-sm text-slate-500">
//               <div className="flex items-center space-x-2">
//                 <Target className="w-4 h-4" />
//                 <span>Content-Based Questions</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <TrendingUp className="w-4 h-4" />
//                 <span>Medium-Hard Difficulty</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Brain className="w-4 h-4" />
//                 <span>AI-Powered Analysis</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Test Phase
//   if (testPhase === 'test' && questions.length > 0) {
//     const currentQuestion = questions[currentQuestionIndex];
//     const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

//     return (
//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* Test Header */}
//         <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 rounded-2xl text-white">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center space-x-3">
//               <Brain className="w-8 h-8" />
//               <div>
//                 <h2 className="text-2xl font-bold">Theory Assessment</h2>
//                 <p className="text-indigo-100 text-sm">Based on: {topic}</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <p className="text-indigo-100">Question {currentQuestionIndex + 1} of {questions.length}</p>
//               <p className="text-indigo-100 text-sm">{subject}</p>
//               <div className="flex items-center space-x-2 mt-1">
//                 <div className={`px-2 py-1 rounded text-xs font-medium ${
//                   currentQuestion.difficulty === 'hard' 
//                     ? 'bg-red-500/20 text-red-100' 
//                     : 'bg-yellow-500/20 text-yellow-100'
//                 }`}>
//                   {currentQuestion.difficulty.toUpperCase()}
//                 </div>
//                 <div className="px-2 py-1 bg-white/20 text-white rounded text-xs font-medium">
//                   {currentQuestion.questionType}
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Progress Bar */}
//           <div className="w-full bg-indigo-400 rounded-full h-3">
//             <div 
//               className="bg-white h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
//               style={{ width: `${progress}%` }}
//             >
//               <span className="text-indigo-600 text-xs font-bold">{Math.round(progress)}%</span>
//             </div>
//           </div>
//         </div>

//         {/* Question */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//           <div className="mb-6">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center space-x-2">
//                 <BookOpen className="w-5 h-5 text-indigo-600" />
//                 <span className="text-sm font-medium text-indigo-600">{currentQuestion.topic}</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className={`px-3 py-1 rounded-full text-xs font-medium ${
//                   currentQuestion.difficulty === 'hard' 
//                     ? 'bg-red-100 text-red-800' 
//                     : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {currentQuestion.difficulty === 'hard' ? '🔴 HARD' : '🟡 MEDIUM'}
//                 </div>
//                 <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
//                   {currentQuestion.questionType}
//                 </div>
//               </div>
//             </div>
//             <h3 className="text-lg font-semibold text-slate-800 leading-relaxed">
//               {currentQuestion.question}
//             </h3>
//           </div>

//           {/* Options */}
//           <div className="space-y-3">
//             {currentQuestion.options.map((option, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleAnswerSelect(index)}
//                 className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
//                   userAnswers[currentQuestionIndex] === index
//                     ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
//                     : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
//                 }`}
//               >
//                 <div className="flex items-center space-x-3">
//                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
//                     userAnswers[currentQuestionIndex] === index
//                       ? 'border-indigo-500 bg-indigo-500 text-white'
//                       : 'border-slate-300'
//                   }`}>
//                     {userAnswers[currentQuestionIndex] === index && (
//                       <CheckCircle className="w-4 h-4" />
//                     )}
//                   </div>
//                   <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
//                   <span className="flex-1">{option}</span>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Navigation */}
//         <div className="flex justify-between">
//           <button
//             onClick={handlePreviousQuestion}
//             disabled={currentQuestionIndex === 0}
//             className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Previous
//           </button>
          
//           <div className="flex items-center space-x-4">
//             <div className="text-sm text-slate-600">
//               {userAnswers.filter(a => a !== -1).length} of {questions.length} answered
//             </div>
//             <button
//               onClick={handleNextQuestion}
//               disabled={userAnswers[currentQuestionIndex] === -1}
//               className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {currentQuestionIndex === questions.length - 1 ? 'Finish Assessment' : 'Next'}
//             </button>
//           </div>
//         </div>

//         {isAnalyzing && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-md">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//               <p className="text-slate-800 font-medium">Analyzing Your Performance</p>
//               <p className="text-slate-600 text-sm">Generating detailed insights and recommendations</p>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // Results Phase
//   if (testPhase === 'results' && testResult) {
//     return (
//       <div className="max-w-5xl mx-auto space-y-6">
//         {/* Results Header */}
//         <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl text-white">
//           <div className="flex items-center space-x-3 mb-4">
//             <Award className="w-8 h-8" />
//             <h2 className="text-2xl font-bold">Assessment Results</h2>
//           </div>
//           <p className="text-green-100">
//             Theory-based assessment for "{testResult.topic}" in {testResult.subject}
//           </p>
//           <div className="mt-4 flex items-center space-x-4 text-sm">
//             <div className="flex items-center space-x-2">
//               <Brain className="w-4 h-4" />
//               <span>Content-Based Analysis</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Target className="w-4 h-4" />
//               <span>Medium-Hard Questions</span>
//             </div>
//           </div>
//         </div>

//         {/* Score Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
//             <div className={`text-3xl font-bold mb-2 ${
//               testResult.score >= 85 ? 'text-green-600' :
//               testResult.score >= 70 ? 'text-blue-600' :
//               testResult.score >= 55 ? 'text-yellow-600' : 'text-red-600'
//             }`}>
//               {testResult.score}%
//             </div>
//             <p className="text-slate-600">Overall Score</p>
//             <p className="text-xs text-slate-500 mt-1">
//               {testResult.score >= 85 ? 'Excellent' :
//                testResult.score >= 70 ? 'Good' :
//                testResult.score >= 55 ? 'Fair' : 'Needs Work'}
//             </p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
//             <div className="text-3xl font-bold text-blue-600 mb-2">
//               {testResult.correctAnswers}/{testResult.totalQuestions}
//             </div>
//             <p className="text-slate-600">Correct Answers</p>
//             <p className="text-xs text-slate-500 mt-1">Sophisticated Questions</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
//             <div className="text-3xl font-bold text-purple-600 mb-2">{testResult.timeSpent}m</div>
//             <p className="text-slate-600">Time Spent</p>
//             <p className="text-xs text-slate-500 mt-1">
//               {testResult.timeSpent < 15 ? 'Quick Thinking' :
//                testResult.timeSpent > 25 ? 'Thorough Analysis' : 'Good Pacing'}
//             </p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
//             <div className="text-3xl font-bold text-orange-600 mb-2">
//               {Math.ceil(testResult.score / 10)}/10
//             </div>
//             <p className="text-slate-600">Performance Score</p>
//             <p className="text-xs text-slate-500 mt-1">Study Session Rating</p>
//           </div>
//         </div>

//         {/* AI Analysis */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//           <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
//             <Brain className="w-5 h-5 text-indigo-600" />
//             <span>AI Performance Analysis</span>
//           </h3>
//           <div className="prose max-w-none">
//             <p className="text-slate-700 leading-relaxed">{testResult.detailedAnalysis}</p>
//           </div>
//         </div>

//         {/* Strong & Weak Areas */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//             <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center space-x-2">
//               <TrendingUp className="w-5 h-5" />
//               <span>Strong Areas</span>
//             </h3>
//             <div className="space-y-3">
//               {testResult.strongAreas.map((area, index) => (
//                 <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
//                   <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
//                   <span className="text-slate-700 font-medium">{area}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//             <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center space-x-2">
//               <AlertCircle className="w-5 h-5" />
//               <span>Areas for Improvement</span>
//             </h3>
//             <div className="space-y-3">
//               {testResult.weakAreas.map((area, index) => (
//                 <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
//                   <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
//                   <span className="text-slate-700 font-medium">{area}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Recommendations */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//           <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
//             <Target className="w-5 h-5 text-purple-600" />
//             <span>AI Recommendations</span>
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h4 className="font-medium text-slate-700 mb-3">Study Recommendations</h4>
//               <ul className="space-y-2">
//                 {testResult.recommendations.map((rec, index) => (
//                   <li key={index} className="flex items-start space-x-2">
//                     <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
//                     <span className="text-slate-600">{rec}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-medium text-slate-700 mb-3">Next Steps</h4>
//               <ul className="space-y-2">
//                 {testResult.nextSteps.map((step, index) => (
//                   <li key={index} className="flex items-start space-x-2">
//                     <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
//                     <span className="text-slate-600">{step}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Detailed Question Review */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//           <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center space-x-2">
//             <BookOpen className="w-5 h-5 text-blue-600" />
//             <span>Question-by-Question Review</span>
//           </h3>
          
//           <div className="space-y-6">
//             {testResult.questions.map((question, index) => {
//               const userAnswer = testResult.userAnswers[index];
//               const isCorrect = userAnswer === question.correctAnswer;
              
//               return (
//                 <div key={question.id} className={`p-6 rounded-lg border-2 ${
//                   isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
//                 }`}>
//                   {/* Question Header */}
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-center space-x-3">
//                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
//                         isCorrect ? 'bg-green-600' : 'bg-red-600'
//                       }`}>
//                         {index + 1}
//                       </div>
//                       <div>
//                         <div className="flex items-center space-x-2">
//                           <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                             isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                           }`}>
//                             {isCorrect ? 'Correct' : 'Incorrect'}
//                           </span>
//                           <span className={`px-2 py-1 rounded text-xs font-medium ${
//                             question.difficulty === 'hard' 
//                               ? 'bg-red-100 text-red-700' 
//                               : 'bg-yellow-100 text-yellow-700'
//                           }`}>
//                             {question.difficulty.toUpperCase()}
//                           </span>
//                         </div>
//                         <p className="text-xs text-slate-500 mt-1">{question.topic}</p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       {isCorrect ? (
//                         <CheckCircle className="w-6 h-6 text-green-600" />
//                       ) : (
//                         <AlertCircle className="w-6 h-6 text-red-600" />
//                       )}
//                     </div>
//                   </div>

//                   {/* Question Text */}
//                   <div className="mb-4">
//                     <h4 className="font-semibold text-slate-800 leading-relaxed">
//                       {question.question}
//                     </h4>
//                   </div>

//                   {/* Answer Options */}
//                   <div className="space-y-3 mb-4">
//                     {question.options.map((option, optionIndex) => {
//                       const isUserAnswer = userAnswer === optionIndex;
//                       const isCorrectAnswer = question.correctAnswer === optionIndex;
                      
//                       let optionClass = 'border-slate-200 bg-white';
//                       let textClass = 'text-slate-700';
                      
//                       if (isCorrectAnswer) {
//                         optionClass = 'border-green-500 bg-green-100';
//                         textClass = 'text-green-800';
//                       } else if (isUserAnswer && !isCorrect) {
//                         optionClass = 'border-red-500 bg-red-100';
//                         textClass = 'text-red-800';
//                       }
                      
//                       return (
//                         <div
//                           key={optionIndex}
//                           className={`p-4 rounded-lg border-2 ${optionClass} transition-all`}
//                         >
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center space-x-3 flex-1">
//                               <span className={`font-medium ${textClass}`}>
//                                 {String.fromCharCode(65 + optionIndex)}.
//                               </span>
//                               <span className={`${textClass} flex-1`}>{option}</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               {isUserAnswer && (
//                                 <span className={`px-2 py-1 rounded text-xs font-medium ${
//                                   isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
//                                 }`}>
//                                   Your Answer
//                                 </span>
//                               )}
//                               {isCorrectAnswer && (
//                                 <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-medium">
//                                   Correct Answer
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {/* Explanation */}
//                   <div className={`p-4 rounded-lg ${
//                     isCorrect ? 'bg-green-100 border border-green-200' : 'bg-blue-100 border border-blue-200'
//                   }`}>
//                     <h5 className={`font-medium mb-2 ${
//                       isCorrect ? 'text-green-800' : 'text-blue-800'
//                     }`}>
//                       Explanation:
//                     </h5>
//                     <p className={`text-sm ${
//                       isCorrect ? 'text-green-700' : 'text-blue-700'
//                     }`}>
//                       {question.explanation}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
//           <button
//             onClick={handleBackToTheory}
//             className="flex items-center justify-center space-x-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span>Back to Theory</span>
//           </button>
          
//           <button
//             onClick={resetQuiz}
//             className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
//           >
//             <RotateCcw className="w-5 h-5" />
//             <span>Retake Assessment</span>
//           </button>
          
//           <button
//             onClick={handleBackToCourse}
//             className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
//           >
//             <BookOpen className="w-5 h-5" />
//             <span>Continue Course</span>
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return null;
// };

// export default TheoryQuizSession;





















// -------------------- Fluctuation improvement --------------


// // src/components/Courses/TheoryQuizSession.tsx
// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Brain, CheckCircle, AlertCircle, TrendingUp, BookOpen, Target, Clock, Award, ArrowLeft, RotateCcw } from 'lucide-react';
// import { AIService } from '../../lib/mistralAI';
// import { useAuth } from '../../hooks/useAuth';
// import { useProgress } from '../../hooks/useProgress';

// interface Question {
//   id: string;
//   question: string;
//   options: string[];
//   correctAnswer: number;
//   explanation: string;
//   topic: string;
//   difficulty: 'medium' | 'hard';
//   questionType: string;
// }

// interface TestResult {
//   score: number;
//   totalQuestions: number;
//   correctAnswers: number;
//   timeSpent: number;
//   strongAreas: string[];
//   weakAreas: string[];
//   detailedAnalysis: string;
//   recommendations: string[];
//   nextSteps: string[];
//   questions: Question[]; 
//   userAnswers: number[];
//   subject: string;
//   topic: string;
// }

// const TheoryQuizSession: React.FC = () => {
//   const { user } = useAuth();
//   const { addStudySession } = useProgress(user?.id);
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [userAnswers, setUserAnswers] = useState<number[]>([]);
//   const [testResult, setTestResult] = useState<TestResult | null>(null);
//   const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [testStartTime, setTestStartTime] = useState<Date | null>(null);
//   const [testPhase, setTestPhase] = useState<'generating' | 'test' | 'results'>('generating');
//   const [subject, setSubject] = useState('');
//   const [topic, setTopic] = useState('');
//   const [theoryContent, setTheoryContent] = useState('');

//   // Extract data from navigation state
//   useEffect(() => {
//     const state = location.state as any;
//     const initialSubject = state?.subject;
//     const initialTopic = state?.topic;
//     const initialTheoryContent = state?.theoryContent;

//     // Only proceed if all necessary data is present and has actually changed
//     if (initialSubject && initialTopic && initialTheoryContent && 
//         (initialSubject !== subject || initialTopic !== topic || initialTheoryContent !== theoryContent)) {
      
//       setSubject(initialSubject);
//       setTopic(initialTopic);
//       setTheoryContent(initialTheoryContent);
//       generateQuizFromContent(initialTheoryContent, initialSubject, initialTopic);
//     } else if (!initialSubject || !initialTopic || !initialTheoryContent) {
//       // Redirect back if no content provided
//       navigate('/courses', { replace: true });
//     }
//   }, [location.state, navigate, subject, topic, theoryContent]); // Added subject, topic, theoryContent to dependencies

//   const generateQuizFromContent = async (content: string, subjectName: string, topicName: string) => {
//     setIsGeneratingQuiz(true);
    
//     try {
//       const testQuestions = await AIService.generateTheoryQuizQuestions(content, subjectName, topicName);
      
//       let parsedQuestions: Question[];
//       try {
//         const firstBrace = testQuestions.indexOf('{');
//         const lastBrace = testQuestions.lastIndexOf('}');
        
//         if (firstBrace !== -1 && lastBrace !== -1) {
//           const jsonString = testQuestions.substring(firstBrace, lastBrace + 1);
//           const parsed = JSON.parse(jsonString);
//           parsedQuestions = parsed.questions || [];
//         } else {
//           throw new Error('No valid JSON found');
//         }
//       } catch (parseError) {
//         console.error('Error parsing AI questions:', parseError);
//         // Enhanced fallback questions based on content
//         parsedQuestions = createFallbackQuestions(content, subjectName, topicName);
//       }

//       setQuestions(parsedQuestions);
//       setUserAnswers(new Array(parsedQuestions.length).fill(-1));
//       setTestPhase('test');
//       setTestStartTime(new Date());
      
//     } catch (error) {
//       console.error('Error generating quiz:', error);
//       alert('Error generating quiz. Please try again.');
//       navigate(-1); // Go back to previous page
//     } finally {
//       setIsGeneratingQuiz(false);
//     }
//   };

//   const createFallbackQuestions = (content: string, subjectName: string, topicName: string): Question[] => {
//     const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
//     const keyTerms = content.toLowerCase().match(/\b[a-z]{4,}\b/g)?.slice(0, 10) || [];
//     const hasFormulas = /\$.*\$/.test(content) || /[=+\-*/()0-9]/.test(content);
    
//     return [
//       {
//         id: '1',
//         question: `Analyze the core principles of ${topicName} as presented in the theory. Which statement best demonstrates the interconnection between the key concepts?`,
//         options: [
//           sentences[0]?.substring(0, 80) + '...' || 'The concepts are fundamentally interconnected through shared theoretical foundations',
//           sentences[1]?.substring(0, 80) + '...' || 'Each concept operates independently without significant theoretical overlap',
//           'The relationships are purely mathematical without conceptual significance',
//           'The concepts contradict each other in fundamental ways'
//         ],
//         correctAnswer: 0,
//         explanation: `This demonstrates deep understanding of how the theoretical concepts in ${topicName} work together within the ${subjectName} framework.`,
//         topic: `${topicName} - Conceptual Analysis`,
//         difficulty: 'medium' as const,
//         questionType: 'analysis'
//       },
//       {
//         id: '2',
//         question: hasFormulas ? 
//           `Evaluate the mathematical relationships in ${topicName}. If the given conditions were modified, what would be the most significant impact?` :
//           `Critically assess the theoretical approach in ${topicName}. What would be the primary limitation in complex applications?`,
//         options: [
//           hasFormulas ? 'The mathematical relationships would require complete theoretical recalibration' : 'The theoretical limitations would become more pronounced in complex scenarios',
//           hasFormulas ? 'Only minor numerical adjustments would be needed' : 'The approach would remain equally effective in all scenarios',
//           hasFormulas ? 'The mathematical formulations would become completely invalid' : 'No significant limitations would emerge in practice',
//           hasFormulas ? 'The relationships would reverse their fundamental nature' : 'The approach would become more robust under complexity'
//         ],
//         correctAnswer: 0,
//         explanation: `This requires critical evaluation of the ${topicName} framework and understanding of its theoretical limitations and dependencies.`,
//         topic: `${topicName} - Critical Evaluation`,
//         difficulty: 'hard' as const,
//         questionType: 'evaluation'
//       },
//       {
//         id: '3',
//         question: keyTerms.length > 1 ? 
//           `Compare the roles of "${keyTerms[0]}" and "${keyTerms[1]}" in the ${topicName} framework. What is their most significant functional difference?` :
//           `Analyze the hierarchical structure of concepts in ${topicName}. Which element serves as the foundational basis?`,
//         options: [
//           keyTerms.length > 1 ? `${keyTerms[0]} provides structural foundation while ${keyTerms[1]} enables dynamic functionality` : 'The foundational element establishes the theoretical basis for all subsequent concepts',
//           keyTerms.length > 1 ? `${keyTerms[0]} and ${keyTerms[1]} serve identical functions in different contexts` : 'All elements contribute equally without hierarchical structure',
//           keyTerms.length > 1 ? `${keyTerms[1]} is more fundamental than ${keyTerms[0]} in all applications` : 'The most complex element serves as the foundation',
//           keyTerms.length > 1 ? `Both terms represent the same concept with different terminology` : 'No single element is more foundational than others'
//         ],
//         correctAnswer: 0,
//         explanation: `This requires comparative analysis and understanding of the functional roles of different elements within the ${topicName} theoretical system.`,
//         topic: `${topicName} - Comparative Analysis`,
//         difficulty: 'medium' as const,
//         questionType: 'comparison'
//       }
//     ];
//   };

//   const handleAnswerSelect = (answerIndex: number) => {
//     const newAnswers = [...userAnswers];
//     newAnswers[currentQuestionIndex] = answerIndex;
//     setUserAnswers(newAnswers);
//   };

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       finishQuiz();
//     }
//   };

//   const handlePreviousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const finishQuiz = async () => {
//     if (!testStartTime || !user) return;

//     setIsAnalyzing(true);
//     const timeSpent = Math.floor((new Date().getTime() - testStartTime.getTime()) / 1000 / 60);
    
//     try {
//       // Calculate basic results
//       const correctAnswers = userAnswers.reduce((count, answer, index) => {
//         return answer === questions[index]?.correctAnswer ? count + 1 : count;
//       }, 0);
      
//       const score = Math.round((correctAnswers / questions.length) * 100);
      
//       // Create detailed analysis based on question types and difficulty
//       const questionAnalysis = questions.map((q, index) => ({
//         question: q.question,
//         topic: q.topic,
//         difficulty: q.difficulty,
//         questionType: q.questionType,
//         userAnswer: userAnswers[index],
//         correctAnswer: q.correctAnswer,
//         isCorrect: userAnswers[index] === q.correctAnswer
//       }));

//       // Analyze performance by question type and difficulty
//       const hardQuestions = questionAnalysis.filter(q => q.difficulty === 'hard');
//       const mediumQuestions = questionAnalysis.filter(q => q.difficulty === 'medium');
//       const hardCorrect = hardQuestions.filter(q => q.isCorrect).length;
//       const mediumCorrect = mediumQuestions.filter(q => q.isCorrect).length;

//       const analysisTypes = questionAnalysis.reduce((acc, q) => {
//         if (!acc[q.questionType]) acc[q.questionType] = { correct: 0, total: 0 };
//         acc[q.questionType].total++;
//         if (q.isCorrect) acc[q.questionType].correct++;
//         return acc;
//       }, {} as Record<string, { correct: number; total: number }>);

//       // Generate sophisticated analysis
//       const strongAreas = [];
//       const weakAreas = [];
//       const recommendations = [];
//       const nextSteps = [];

//       // Analyze by question type
//       Object.entries(analysisTypes).forEach(([type, stats]) => {
//         const percentage = (stats.correct / stats.total) * 100;
//         if (percentage >= 70) {
//           strongAreas.push(`${type.charAt(0).toUpperCase() + type.slice(1)} skills in ${topic}`);
//         } else {
//           weakAreas.push(`${type.charAt(0).toUpperCase() + type.slice(1)} abilities in ${topic}`);
//         }
//       });

//       // Analyze by difficulty
//       if (hardQuestions.length > 0) {
//         const hardPercentage = (hardCorrect / hardQuestions.length) * 100;
//         if (hardPercentage >= 60) {
//           strongAreas.push(`Advanced conceptual understanding of ${topic}`);
//         } else {
//           weakAreas.push(`Complex problem-solving in ${topic}`);
//           recommendations.push(`Focus on advanced applications and complex scenarios in ${topic}`);
//         }
//       }

//       if (mediumQuestions.length > 0) {
//         const mediumPercentage = (mediumCorrect / mediumQuestions.length) * 100;
//         if (mediumPercentage >= 70) {
//           strongAreas.push(`Solid grasp of intermediate ${topic} concepts`);
//         } else {
//           weakAreas.push(`Intermediate concept application in ${topic}`);
//           recommendations.push(`Strengthen understanding of core ${topic} principles`);
//         }
//       }

//       // Generate recommendations based on performance
//       if (score >= 85) {
//         recommendations.push(`Excellent mastery of ${topic}! Ready for advanced topics in ${subject}`);
//         recommendations.push(`Consider exploring practical applications and real-world scenarios`);
//         nextSteps.push(`Proceed to next advanced topic in ${subject}`);
//         nextSteps.push(`Take on challenging problem-solving exercises`);
//       } else if (score >= 70) {
//         recommendations.push(`Good understanding of ${topic}. Focus on strengthening weak areas`);
//         recommendations.push(`Practice more complex application problems`);
//         nextSteps.push(`Review challenging concepts before advancing`);
//         nextSteps.push(`Take additional practice quizzes on similar topics`);
//       } else {
//         recommendations.push(`${topic} requires more focused study and practice`);
//         recommendations.push(`Revisit the theory content and create detailed notes`);
//         nextSteps.push(`Re-read the theory content thoroughly`);
//         nextSteps.push(`Seek additional resources for ${topic} in ${subject}`);
//       }

//       const detailedAnalysis = `Your performance on this ${topic} theory-based assessment demonstrates ${
//         score >= 85 ? 'excellent mastery' : 
//         score >= 70 ? 'good understanding' : 
//         score >= 55 ? 'developing comprehension' : 'foundational gaps'
//       } of the content. You completed ${questions.length} sophisticated questions in ${timeSpent} minutes, showing ${
//         timeSpent < 15 ? 'quick analytical thinking' : 
//         timeSpent > 25 ? 'thorough consideration' : 'balanced pacing'
//       }. ${hardQuestions.length > 0 ? `On advanced questions, you achieved ${Math.round((hardCorrect / hardQuestions.length) * 100)}% accuracy. ` : ''}${
//         score >= 70 ? 'Your conceptual understanding is solid and ready for practical applications.' : 'Focus on strengthening theoretical foundations before advancing.'
//       }`;

//       const result: TestResult = {
//         score,
//         totalQuestions: questions.length,
//         correctAnswers,
//         timeSpent,
//         strongAreas,
//         weakAreas,
//         detailedAnalysis,
//         recommendations,
//         nextSteps,
//         questions,
//         userAnswers,
//         subject,
//         topic
//       };

//       setTestResult(result);
//       setTestPhase('results');

//       // Save study session
//       await addStudySession({
//         user_id: user.id,
//         subject: subject,
//         duration_minutes: timeSpent,
//         topics_covered: [topic],
//         performance_score: Math.max(1, Math.ceil(score / 10)), // Convert percentage to 1-10 scale
//       });

//     } catch (error) {
//       console.error('Error analyzing quiz:', error);
//       alert('Error analyzing quiz results. Please try again.');
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const resetQuiz = () => {
//     setTestPhase('generating');
//     setQuestions([]);
//     setUserAnswers([]);
//     setCurrentQuestionIndex(0);
//     setTestResult(null);
//     setTestStartTime(null);
    
//     // Regenerate quiz with same content
//     if (theoryContent && subject && topic) {
//       generateQuizFromContent(theoryContent, subject, topic);
//     }
//   };

//   const handleBackToCourse = () => {
//     navigate(`/courses/${encodeURIComponent(subject)}`, { replace: true });
//   };

//   const handleBackToTheory = () => {
//     navigate(`/courses/${encodeURIComponent(subject)}/theory/${encodeURIComponent(topic)}`, { replace: true });
//   };

//   // Generating Phase
//   if (testPhase === 'generating') {
//     return (
//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 rounded-2xl text-white">
//           <div className="flex items-center space-x-3 mb-4">
//             <Brain className="w-8 h-8" />
//             <h2 className="text-2xl font-bold">AI Theory Assessment</h2>
//           </div>
//           <p className="text-purple-100">
//             Generating sophisticated questions based on your study of "{topic}" in {subject}
//           </p>
//         </div>

//         {/* Loading State */}
//         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
//           <div className="flex flex-col items-center justify-center py-12">
//             <div className="relative mb-6">
//               <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
//               <Brain className="w-8 h-8 text-purple-600 absolute top-4 left-4" />
//             </div>
//             <h3 className="text-xl font-semibold text-slate-800 mb-2">Generating Advanced Assessment</h3>
//             <p className="text-slate-600 text-center max-w-md mb-4">
//               AI is analyzing the theory content you just studied and creating sophisticated, 
//               medium-to-hard level questions to test your understanding of <strong>{topic}</strong>
//             </p>
//             <div className="flex items-center space-x-4 text-sm text-slate-500">
//               <div className="flex items-center space-x-2">
//                 <Target className="w-4 h-4" />
//                 <span>Content-Based Questions</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <TrendingUp className="w-4 h-4" />
//                 <span>Medium-Hard Difficulty</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Brain className="w-4 h-4" />
//                 <span>AI-Powered Analysis</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Test Phase
//   if (testPhase === 'test' && questions.length > 0) {
//     const currentQuestion = questions[currentQuestionIndex];
//     const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

//     return (
//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* Test Header */}
//         <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 rounded-2xl text-white">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center space-x-3">
//               <Brain className="w-8 h-8" />
//               <div>
//                 <h2 className="text-2xl font-bold">Theory Assessment</h2>
//                 <p className="text-indigo-100 text-sm">Based on: {topic}</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <p className="text-indigo-100">Question {currentQuestionIndex + 1} of {questions.length}</p>
//               <p className="text-indigo-100 text-sm">{subject}</p>
//               <div className="flex items-center space-x-2 mt-1">
//                 <div className={`px-2 py-1 rounded text-xs font-medium ${
//                   currentQuestion.difficulty === 'hard' 
//                     ? 'bg-red-500/20 text-red-100' 
//                     : 'bg-yellow-500/20 text-yellow-100'
//                 }`}>
//                   {currentQuestion.difficulty.toUpperCase()}
//                 </div>
//                 <div className="px-2 py-1 bg-white/20 text-white rounded text-xs font-medium">
//                   {currentQuestion.questionType}
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Progress Bar */}
//           <div className="w-full bg-indigo-400 rounded-full h-3">
//             <div 
//               className="bg-white h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
//               style={{ width: `${progress}%` }}
//             >
//               <span className="text-indigo-600 text-xs font-bold">{Math.round(progress)}%</span>
//             </div>
//           </div>
//         </div>

//         {/* Question */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//           <div className="mb-6">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center space-x-2">
//                 <BookOpen className="w-5 h-5 text-indigo-600" />
//                 <span className="text-sm font-medium text-indigo-600">{currentQuestion.topic}</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className={`px-3 py-1 rounded-full text-xs font-medium ${
//                   currentQuestion.difficulty === 'hard' 
//                     ? 'bg-red-100 text-red-800' 
//                     : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {currentQuestion.difficulty.toUpperCase()}
//                 </div>
//                 <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
//                   {currentQuestion.questionType}
//                 </div>
//               </div>
//             </div>
//             <h3 className="text-lg font-semibold text-slate-800 leading-relaxed">
//               {currentQuestion.question}
//             </h3>
//           </div>

//           {/* Options */}
//           <div className="space-y-3">
//             {currentQuestion.options.map((option, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleAnswerSelect(index)}
//                 className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
//                   userAnswers[currentQuestionIndex] === index
//                     ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
//                     : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
//                 }`}
//               >
//                 <div className="flex items-center space-x-3">
//                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
//                     userAnswers[currentQuestionIndex] === index
//                       ? 'border-indigo-500 bg-indigo-500 text-white'
//                       : 'border-slate-300'
//                   }`}>
//                     {userAnswers[currentQuestionIndex] === index && (
//                       <CheckCircle className="w-4 h-4" />
//                     )}
//                   </div>
//                   <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
//                   <span className="flex-1">{option}</span>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Navigation */}
//         <div className="flex justify-between">
//           <button
//             onClick={handlePreviousQuestion}
//             disabled={currentQuestionIndex === 0}
//             className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Previous
//           </button>
          
//           <div className="flex items-center space-x-4">
//             <div className="text-sm text-slate-600">
//               {userAnswers.filter(a => a !== -1).length} of {questions.length} answered
//             </div>
//             <button
//               onClick={handleNextQuestion}
//               disabled={userAnswers[currentQuestionIndex] === -1}
//               className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {currentQuestionIndex === questions.length - 1 ? 'Finish Assessment' : 'Next'}
//             </button>
//           </div>
//         </div>

//         {isAnalyzing && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-md">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//               <p className="text-slate-800 font-medium">Analyzing Your Performance</p>
//               <p className="text-slate-600 text-sm">Generating detailed insights and recommendations</p>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // Results Phase
//   if (testPhase === 'results' && testResult) {
//     return (
//       <div className="max-w-5xl mx-auto space-y-6">
//         {/* Results Header */}
//         <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl text-white">
//           <div className="flex items-center space-x-3 mb-4">
//             <Award className="w-8 h-8" />
//             <h2 className="text-2xl font-bold">Assessment Results</h2>
//           </div>
//           <p className="text-green-100">
//             Theory-based assessment for "{testResult.topic}" in {testResult.subject}
//           </p>
//           <div className="mt-4 flex items-center space-x-4 text-sm">
//             <div className="flex items-center space-x-2">
//               <Brain className="w-4 h-4" />
//               <span>Content-Based Analysis</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Target className="w-4 h-4" />
//               <span>Medium-Hard Questions</span>
//             </div>
//           </div>
//         </div>

//         {/* Score Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
//             <div className={`text-3xl font-bold mb-2 ${
//               testResult.score >= 85 ? 'text-green-600' :
//               testResult.score >= 70 ? 'text-blue-600' :
//               testResult.score >= 55 ? 'text-yellow-600' : 'text-red-600'
//             }`}>
//               {testResult.score}%
//             </div>
//             <p className="text-slate-600">Overall Score</p>
//             <p className="text-xs text-slate-500 mt-1">
//               {testResult.score >= 85 ? 'Excellent' :
//                testResult.score >= 70 ? 'Good' :
//                testResult.score >= 55 ? 'Fair' : 'Needs Work'}
//             </p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
//             <div className="text-3xl font-bold text-blue-600 mb-2">
//               {testResult.correctAnswers}/{testResult.totalQuestions}
//             </div>
//             <p className="text-slate-600">Correct Answers</p>
//             <p className="text-xs text-slate-500 mt-1">Sophisticated Questions</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
//             <div className="text-3xl font-bold text-purple-600 mb-2">{testResult.timeSpent}m</div>
//             <p className="text-slate-600">Time Spent</p>
//             <p className="text-xs text-slate-500 mt-1">
//               {testResult.timeSpent < 15 ? 'Quick Thinking' :
//                testResult.timeSpent > 25 ? 'Thorough Analysis' : 'Good Pacing'}
//             </p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
//             <div className="text-3xl font-bold text-orange-600 mb-2">
//               {Math.ceil(testResult.score / 10)}/10
//             </div>
//             <p className="text-slate-600">Performance Score</p>
//             <p className="text-xs text-slate-500 mt-1">Study Session Rating</p>
//           </div>
//         </div>

//         {/* AI Analysis */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//           <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
//             <Brain className="w-5 h-5 text-indigo-600" />
//             <span>AI Performance Analysis</span>
//           </h3>
//           <div className="prose max-w-none">
//             <p className="text-slate-700 leading-relaxed">{testResult.detailedAnalysis}</p>
//           </div>
//         </div>

//         {/* Strong & Weak Areas */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//             <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center space-x-2">
//               <TrendingUp className="w-5 h-5" />
//               <span>Strong Areas</span>
//             </h3>
//             <div className="space-y-3">
//               {testResult.strongAreas.map((area, index) => (
//                 <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
//                   <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
//                   <span className="text-slate-700 font-medium">{area}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//             <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center space-x-2">
//               <AlertCircle className="w-5 h-5" />
//               <span>Areas for Improvement</span>
//             </h3>
//             <div className="space-y-3">
//               {testResult.weakAreas.map((area, index) => (
//                 <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
//                   <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
//                   <span className="text-slate-700 font-medium">{area}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Recommendations */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//           <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
//             <Target className="w-5 h-5 text-purple-600" />
//             <span>AI Recommendations</span>
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h4 className="font-medium text-slate-700 mb-3">Study Recommendations</h4>
//               <ul className="space-y-2">
//                 {testResult.recommendations.map((rec, index) => (
//                   <li key={index} className="flex items-start space-x-2">
//                     <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
//                     <span className="text-slate-600">{rec}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-medium text-slate-700 mb-3">Next Steps</h4>
//               <ul className="space-y-2">
//                 {testResult.nextSteps.map((step, index) => (
//                   <li key={index} className="flex items-start space-x-2">
//                     <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
//                     <span className="text-slate-600">{step}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//                   {/* Detailed Question Review */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//           <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center space-x-2">
//             <BookOpen className="w-5 h-5 text-blue-600" />
//             <span>Question-by-Question Review</span>
//           </h3>
          
//           <div className="space-y-6">
//             {testResult.questions.map((question, index) => {
//               const userAnswer = testResult.userAnswers[index];
//               const isCorrect = userAnswer === question.correctAnswer;
              
//               return (
//                 <div key={question.id} className={`p-6 rounded-lg border-2 ${
//                   isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
//                 }`}>
//                   {/* Question Header */}
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-center space-x-3">
//                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
//                         isCorrect ? 'bg-green-600' : 'bg-red-600'
//                       }`}>
//                         {index + 1}
//                       </div>
//                       <div>
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                           isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}>
//                           {isCorrect ? 'Correct' : 'Incorrect'}
//                         </span>
//                         <p className="text-xs text-slate-500 mt-1">{question.topic}</p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       {isCorrect ? (
//                         <CheckCircle className="w-6 h-6 text-green-600" />
//                       ) : (
//                         <AlertCircle className="w-6 h-6 text-red-600" />
//                       )}
//                     </div>
//                   </div>

//                   {/* Question Text */}
//                   <div className="mb-4">
//                     <h4 className="font-semibold text-slate-800 leading-relaxed">
//                       {question.question}
//                     </h4>
//                   </div>

//                   {/* Answer Options */}
//                   <div className="space-y-3 mb-4">
//                     {question.options.map((option, optionIndex) => {
//                       const isUserAnswer = userAnswer === optionIndex;
//                       const isCorrectAnswer = question.correctAnswer === optionIndex;
                      
//                       let optionClass = 'border-slate-200 bg-white';
//                       let textClass = 'text-slate-700';
//                       let iconElement = null;
                      
//                       if (isCorrectAnswer) {
//                         optionClass = 'border-green-500 bg-green-100';
//                         textClass = 'text-green-800';
//                         iconElement = <CheckCircle className="w-5 h-5 text-green-600" />;
//                       } else if (isUserAnswer && !isCorrect) {
//                         optionClass = 'border-red-500 bg-red-100';
//                         textClass = 'text-red-800';
//                         iconElement = <AlertCircle className="w-5 h-5 text-red-600" />;
//                       }
                      
//                       return (
//                         <div
//                           key={optionIndex}
//                           className={`p-4 rounded-lg border-2 ${optionClass} transition-all`}
//                         >
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center space-x-3 flex-1">
//                               <span className={`font-medium ${textClass}`}>
//                                 {String.fromCharCode(65 + optionIndex)}.
//                               </span>
//                               <span className={`${textClass} flex-1`}>{option}</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               {isUserAnswer && (
//                                 <span className={`px-2 py-1 rounded text-xs font-medium ${
//                                   isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
//                                 }`}>
//                                   Your Answer
//                                 </span>
//                               )}
//                               {isCorrectAnswer && (
//                                 <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-medium">
//                                   Correct Answer
//                                 </span>
//                               )}
//                               {iconElement}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {/* Explanation */}
//                   <div className={`p-4 rounded-lg ${
//                     isCorrect ? 'bg-green-100 border border-green-200' : 'bg-blue-100 border border-blue-200'
//                   }`}>
//                     <h5 className={`font-medium mb-2 ${
//                       isCorrect ? 'text-green-800' : 'text-blue-800'
//                     }`}>
//                       Explanation:
//                     </h5>
//                     <p className={`text-sm ${
//                       isCorrect ? 'text-green-700' : 'text-blue-700'
//                     }`}>
//                       {question.explanation}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-center space-x-4">
//           <button
//             onClick={resetTest}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
//           >
//             Take Another Test
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return null;
// };

// export default TheoryQuizSession;














// ------------------- Error PopUp Addition -------------------

// src/components/Courses/TheoryQuizSession.tsx
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useLocation, useNavigate } from 'react-router-dom';
import { Brain, CheckCircle, AlertCircle, TrendingUp, BookOpen, Target, Clock, Award, ArrowLeft, RotateCcw } from 'lucide-react';
import { AIService } from '../../lib/mistralAI';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import RetryPopup from '../Common/RetryPopup'; // Import the new popup component

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: 'medium' | 'hard';
  questionType: string;
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
  subject: string;
  topic: string;
}

const TheoryQuizSession: React.FC = () => {
  const { user } = useAuth();
  const { addStudySession } = useProgress(user?.id);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [testStartTime, setTestStartTime] = useState<Date | null>(null);
  const [testPhase, setTestPhase] = useState<'generating' | 'test' | 'results'>('generating');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [theoryContent, setTheoryContent] = useState('');
  const [showRetryPopup, setShowRetryPopup] = useState(false); // New state for popup
  const [popupMessage, setPopupMessage] = useState(''); // New state for popup message

  // Use useCallback to memoize the quiz generation function
  const generateQuizFromContent = useCallback(async (content: string, subjectName: string, topicName: string) => {
    setIsGeneratingQuiz(true);
    setShowRetryPopup(false); // Hide popup on retry
    
    try {
      const testQuestions = await AIService.generateTheoryQuizQuestions(content, subjectName, topicName);
      
      let parsedQuestions: Question[];
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
        // Fallback to a generic error message for the popup
        throw new Error('AI response could not be parsed. It might be malformed or empty.');
      }

      if (parsedQuestions.length === 0) {
        throw new Error('AI generated no questions. Please try again with different content or settings.');
      }

      setQuestions(parsedQuestions);
      setUserAnswers(new Array(parsedQuestions.length).fill(-1));
      setTestPhase('test');
      setTestStartTime(new Date());
      
    } catch (error: any) { // Catch specific errors for popup message
      console.error('Error generating quiz:', error);
      setPopupMessage(error.message || 'We encountered an issue generating the quiz questions. Please try again.');
      setShowRetryPopup(true); // Show popup on error
      setIsGeneratingQuiz(false); // Ensure loading state is off
    } finally {
      // This finally block will only run if no error was thrown or if error was caught and handled
      // If an error was thrown and caught, isGeneratingQuiz is already set to false above.
      // If no error, it should be set to false here.
      if (testPhase !== 'test') { // Only set to false if we didn't transition to 'test' phase
        setIsGeneratingQuiz(false);
      }
    }
  }, [testPhase]); // Added testPhase to dependencies for useCallback

  // Extract data from navigation state
  useEffect(() => {
    const state = location.state as any;
    const initialSubject = state?.subject;
    const initialTopic = state?.topic;
    const initialTheoryContent = state?.theoryContent;

    // Only proceed if all necessary data is present and has actually changed
    if (initialSubject && initialTopic && initialTheoryContent && 
        (initialSubject !== subject || initialTopic !== topic || initialTheoryContent !== theoryContent)) {
      
      setSubject(initialSubject);
      setTopic(initialTopic);
      setTheoryContent(initialTheoryContent);
      generateQuizFromContent(initialTheoryContent, initialSubject, initialTopic);
    } else if (!initialSubject || !initialTopic || !initialTheoryContent) {
      // Redirect back if no content provided
      navigate('/app/courses', { replace: true });
    }
  }, [location.state, navigate, subject, topic, theoryContent, generateQuizFromContent]); // Added generateQuizFromContent to dependencies

  const createFallbackQuestions = (content: string, subjectName: string, topicName: string): Question[] => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
    const keyTerms = content.toLowerCase().match(/\b[a-z]{4,}\b/g)?.slice(0, 10) || [];
    const hasFormulas = /\$.*\$/.test(content) || /[=+\-*/()0-9]/.test(content);
    
    return [
      {
        id: '1',
        question: `Analyze the core principles of ${topicName} as presented in the theory. Which statement best demonstrates the interconnection between the key concepts?`,
        options: [
          sentences[0]?.substring(0, 80) + '...' || 'The concepts are fundamentally interconnected through shared theoretical foundations',
          sentences[1]?.substring(0, 80) + '...' || 'Each concept operates independently without significant theoretical overlap',
          'The relationships are purely mathematical without conceptual significance',
          'The concepts contradict each other in fundamental ways'
        ],
        correctAnswer: 0,
        explanation: `This demonstrates deep understanding of how the theoretical concepts in ${topicName} work together within the ${subjectName} framework.`,
        topic: `${topicName} - Conceptual Analysis`,
        difficulty: 'medium' as const,
        questionType: 'analysis'
      },
      {
        id: '2',
        question: hasFormulas ? 
          `Evaluate the mathematical relationships in ${topicName}. If the given conditions were modified, what would be the most significant impact?` :
          `Critically assess the theoretical approach in ${topicName}. What would be the primary limitation in complex applications?`,
        options: [
          hasFormulas ? 'The mathematical relationships would require complete theoretical recalibration' : 'The theoretical limitations would become more pronounced in complex scenarios',
          hasFormulas ? 'Only minor numerical adjustments would be needed' : 'The approach would remain equally effective in all scenarios',
          hasFormulas ? 'The mathematical formulations would become completely invalid' : 'No significant limitations would emerge in practice',
          hasFormulas ? 'The relationships would reverse their fundamental nature' : 'The approach would become more robust under complexity'
        ],
        correctAnswer: 0,
        explanation: `This requires critical evaluation of the ${topicName} framework and understanding of its theoretical limitations and dependencies.`,
        topic: `${topicName} - Critical Evaluation`,
        difficulty: 'hard' as const,
        questionType: 'evaluation'
      },
      {
        id: '3',
        question: keyTerms.length > 1 ? 
          `Compare the roles of "${keyTerms[0]}" and "${keyTerms[1]}" in the ${topicName} framework. What is their most significant functional difference?` :
          `Analyze the hierarchical structure of concepts in ${topicName}. Which element serves as the foundational basis?`,
        options: [
          keyTerms.length > 1 ? `${keyTerms[0]} provides structural foundation while ${keyTerms[1]} enables dynamic functionality` : 'The foundational element establishes the theoretical basis for all subsequent concepts',
          keyTerms.length > 1 ? `${keyTerms[0]} and ${keyTerms[1]} serve identical functions in different contexts` : 'All elements contribute equally without hierarchical structure',
          keyTerms.length > 1 ? `${keyTerms[1]} is more fundamental than ${keyTerms[0]} in all applications` : 'The most complex element serves as the foundation',
          keyTerms.length > 1 ? `Both terms represent the same concept with different terminology` : 'No single element is more foundational than others'
        ],
        correctAnswer: 0,
        explanation: `This requires comparative analysis and understanding of the functional roles of different elements within the ${topicName} theoretical system.`,
        topic: `${topicName} - Comparative Analysis`,
        difficulty: 'medium' as const,
        questionType: 'comparison'
      }
    ];
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = async () => {
    if (!testStartTime || !user) return;

    setIsAnalyzing(true);
    const timeSpent = Math.floor((new Date().getTime() - testStartTime.getTime()) / 1000 / 60);
    
    try {
      // Calculate basic results
      const correctAnswers = userAnswers.reduce((count, answer, index) => {
        return answer === questions[index]?.correctAnswer ? count + 1 : count;
      }, 0);
      
      const score = Math.round((correctAnswers / questions.length) * 100);
      
      // Create detailed analysis based on question types and difficulty
      const questionAnalysis = questions.map((q, index) => ({
        question: q.question,
        topic: q.topic,
        difficulty: q.difficulty,
        questionType: q.questionType,
        userAnswer: userAnswers[index],
        correctAnswer: q.correctAnswer,
        isCorrect: userAnswers[index] === q.correctAnswer
      }));

      // Analyze performance by question type and difficulty
      const hardQuestions = questionAnalysis.filter(q => q.difficulty === 'hard');
      const mediumQuestions = questionAnalysis.filter(q => q.difficulty === 'medium');
      const hardCorrect = hardQuestions.filter(q => q.isCorrect).length;
      const mediumCorrect = mediumQuestions.filter(q => q.isCorrect).length;

      const analysisTypes = questionAnalysis.reduce((acc, q) => {
        if (!acc[q.questionType]) acc[q.questionType] = { correct: 0, total: 0 };
        acc[q.questionType].total++;
        if (q.isCorrect) acc[q.questionType].correct++;
        return acc;
      }, {} as Record<string, { correct: number; total: number }>);

      // Generate sophisticated analysis
      const strongAreas = [];
      const weakAreas = [];
      const recommendations = [];
      const nextSteps = [];

      // Analyze by question type
      Object.entries(analysisTypes).forEach(([type, stats]) => {
        const percentage = (stats.correct / stats.total) * 100;
        if (percentage >= 70) {
          strongAreas.push(`${type.charAt(0).toUpperCase() + type.slice(1)} skills in ${topic}`);
        } else {
          weakAreas.push(`${type.charAt(0).toUpperCase() + type.slice(1)} abilities in ${topic}`);
        }
      });

      // Analyze by difficulty
      if (hardQuestions.length > 0) {
        const hardPercentage = (hardCorrect / hardQuestions.length) * 100;
        if (hardPercentage >= 60) {
          strongAreas.push(`Advanced conceptual understanding of ${topic}`);
        } else {
          weakAreas.push(`Complex problem-solving in ${topic}`);
          recommendations.push(`Focus on advanced applications and complex scenarios in ${topic}`);
        }
      }

      if (mediumQuestions.length > 0) {
        const mediumPercentage = (mediumCorrect / mediumQuestions.length) * 100;
        if (mediumPercentage >= 70) {
          strongAreas.push(`Solid grasp of intermediate ${topic} concepts`);
        } else {
          weakAreas.push(`Intermediate concept application in ${topic}`);
          recommendations.push(`Strengthen understanding of core ${topic} principles`);
        }
      }

      // Generate recommendations based on performance
      if (score >= 85) {
        recommendations.push(`Excellent mastery of ${topic}! Ready for advanced topics in ${subject}`);
        recommendations.push(`Consider exploring practical applications and real-world scenarios`);
        nextSteps.push(`Proceed to next advanced topic in ${subject}`);
        nextSteps.push(`Take on challenging problem-solving exercises`);
      } else if (score >= 70) {
        recommendations.push(`Good understanding of ${topic}. Focus on strengthening weak areas`);
        recommendations.push(`Practice more complex application problems`);
        nextSteps.push(`Review challenging concepts before advancing`);
        nextSteps.push(`Take additional practice quizzes on similar topics`);
      } else {
        recommendations.push(`${topic} requires more focused study and practice`);
        recommendations.push(`Revisit the theory content and create detailed notes`);
        nextSteps.push(`Re-read the theory content thoroughly`);
        nextSteps.push(`Seek additional resources for ${topic} in ${subject}`);
      }

      const detailedAnalysis = `Your performance on this ${topic} theory-based assessment demonstrates ${
        score >= 85 ? 'excellent mastery' : 
        score >= 70 ? 'good understanding' : 
        score >= 55 ? 'developing comprehension' : 'foundational gaps'
      } of the content. You completed ${questions.length} sophisticated questions in ${timeSpent} minutes, showing ${
        timeSpent < 15 ? 'quick analytical thinking' : 
        timeSpent > 25 ? 'thorough consideration' : 'balanced pacing'
      }. ${hardQuestions.length > 0 ? `On advanced questions, you achieved ${Math.round((hardCorrect / hardQuestions.length) * 100)}% accuracy. ` : ''}${
        score >= 70 ? 'Your conceptual understanding is solid and ready for practical applications.' : 'Focus on strengthening theoretical foundations before advancing.'
      }`;

      const result: TestResult = {
        score,
        totalQuestions: questions.length,
        correctAnswers,
        timeSpent,
        strongAreas,
        weakAreas,
        detailedAnalysis,
        recommendations,
        nextSteps,
        questions,
        userAnswers,
        subject,
        topic
      };

      setTestResult(result);
      setTestPhase('results');

      // Save study session
      await addStudySession({
        user_id: user.id,
        subject: subject,
        duration_minutes: timeSpent,
        topics_covered: [topic],
        performance_score: Math.max(1, Math.ceil(score / 10)), // Convert percentage to 1-10 scale
      });

    } catch (error) {
      console.error('Error analyzing quiz:', error);
      alert('Error analyzing quiz results. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetQuiz = () => {
    setTestPhase('generating');
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setTestResult(null);
    setTestStartTime(null);
    
    // Regenerate quiz with same content
    if (theoryContent && subject && topic) {
      generateQuizFromContent(theoryContent, subject, topic);
    }
  };

  const handleBackToCourse = () => {
    navigate(`/app/courses/${encodeURIComponent(subject)}`, { replace: true });
  };

  const handleBackToTheory = () => {
    navigate(`/app/courses/${encodeURIComponent(subject)}/theory/${encodeURIComponent(topic)}`, { replace: true });
  };

  const handleRetryGenerateQuiz = () => {
    if (theoryContent && subject && topic) {
      generateQuizFromContent(theoryContent, subject, topic);
    }
  };

  const handleCancelGenerateQuiz = () => {
    setShowRetryPopup(false);
    navigate(`/app/courses/${encodeURIComponent(subject)}/theory/${encodeURIComponent(topic)}`); // Go back to theory view
  };

  // Generating Phase
  if (testPhase === 'generating') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 rounded-2xl text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-8 h-8" />
            <h2 className="text-2xl font-bold">AI Theory Assessment</h2>
          </div>
          <p className="text-purple-100">
            Generating sophisticated questions based on your study of "{topic}" in {subject}
          </p>
        </div> */}

        {/* Loading State */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
              <Brain className="w-8 h-8 text-purple-600 absolute top-4 left-4" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Creating Personalised Assessment</h3>
            <p className="text-slate-600 text-center max-w-md mb-4">
              AI is analyzing the theory content you just studied and creating sophisticated, 
              medium-to-hard level questions to test your understanding of <strong>{topic}</strong>
            </p>
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                {/* <Target className="w-4 h-4" /> */}
                <span>Content-Based Questions</span>
              </div>
              <div className="flex items-center space-x-2">
                {/* <TrendingUp className="w-4 h-4" /> */}
                <span>Medium-Hard Difficulty</span>
              </div>
              <div className="flex items-center space-x-2">
                {/* <Brain className="w-4 h-4" /> */}
                <span>AI-Powered Analysis</span>
              </div>
            </div>
          </div>
        </div>
        {/* Retry Popup for generation phase */}
        <RetryPopup
          isOpen={showRetryPopup}
          title="Failed to Generate Quiz"
          message={popupMessage || "We encountered an issue generating the quiz questions. Please try again."}
          onTryAgain={handleRetryGenerateQuiz}
          onCancel={handleCancelGenerateQuiz}
        />
      </div>
    );
  }

  // Test Phase
  if (testPhase === 'test' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto space-y-6 p-3">
        {/* Test Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {/* <Brain className="w-8 h-8" /> */}
              <div>
                <h2 className="text-xl font-bold">Theory Assessment</h2>
                <p className="text-indigo-100 text-sm">Based on: {topic}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-indigo-100 text-sm">Question {currentQuestionIndex + 1} of {questions.length}</p>
              <p className="text-indigo-100 text-sm">{subject}</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  currentQuestion.difficulty === 'hard' 
                    ? 'bg-red-500/20 text-red-100' 
                    : 'bg-yellow-500/20 text-yellow-100'
                }`}>
                  {currentQuestion.difficulty.toUpperCase()}
                </div>
                <div className="px-2 py-1 bg-white/20 text-white rounded text-xs font-medium">
                  {currentQuestion.questionType}
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-indigo-400 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
              style={{ width: `${progress}%` }}
            >
              <span className="text-indigo-600 text-xs font-bold">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {/* <BookOpen className="w-5 h-5 text-indigo-600" /> */}
                <span className="text-sm font-medium text-indigo-600">{currentQuestion.topic}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentQuestion.difficulty === 'hard' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {currentQuestion.difficulty.toUpperCase()}
                </div>
                <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                  {currentQuestion.questionType}
                </div>
              </div>
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
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    userAnswers[currentQuestionIndex] === index
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-slate-300'
                  }`}>
                    {userAnswers[currentQuestionIndex] === index && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                  <span className="flex-1">{option}</span>
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
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-600">
              {userAnswers.filter(a => a !== -1).length} of {questions.length} answered
            </div>
            <button
              onClick={handleNextQuestion}
              disabled={userAnswers[currentQuestionIndex] === -1}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish Assessment' : 'Next'}
            </button>
          </div>
        </div>

        {isAnalyzing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-md">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-slate-800 font-medium">Analyzing Your Performance</p>
              <p className="text-slate-600 text-sm">Generating detailed insights and recommendations</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Results Phase
  if (testPhase === 'results' && testResult) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Results Header */}
        <div className="bg-gradient-to-r dark:from-emerald-700 dark:to-emerald-800 p-6 rounded-2xl text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Assessment Results</h2>
          </div>
          <p className="text-green-100">
            Theory-based assessment for "{testResult.topic}" in {testResult.subject}
          </p>
          <div className="mt-4 flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Content-Based Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Medium-Hard Questions</span>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className={`text-3xl font-bold mb-2 ${
              testResult.score >= 85 ? 'text-green-600' :
              testResult.score >= 70 ? 'text-blue-600' :
              testResult.score >= 55 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {testResult.score}%
            </div>
            <p className="text-slate-600">Overall Score</p>
            <p className="text-xs text-slate-500 mt-1">
              {testResult.score >= 85 ? 'Excellent' :
               testResult.score >= 70 ? 'Good' :
               testResult.score >= 55 ? 'Fair' : 'Needs Work'}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {testResult.correctAnswers}/{testResult.totalQuestions}
            </div>
            <p className="text-slate-600">Correct Answers</p>
            <p className="text-xs text-slate-500 mt-1">Sophisticated Questions</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{testResult.timeSpent}m</div>
            <p className="text-slate-600">Time Spent</p>
            <p className="text-xs text-slate-500 mt-1">
              {testResult.timeSpent < 15 ? 'Quick Thinking' :
               testResult.timeSpent > 25 ? 'Thorough Analysis' : 'Good Pacing'}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {Math.ceil(testResult.score / 10)}/10
            </div>
            <p className="text-slate-600">Performance Score</p>
            <p className="text-xs text-slate-500 mt-1">Study Session Rating</p>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
            <Brain className="w-5 h-5 text-indigo-600" />
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
            <div className="space-y-3">
              {testResult.strongAreas.map((area, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-slate-700 font-medium">{area}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>Areas for Improvement</span>
            </h3>
            <div className="space-y-3">
              {testResult.weakAreas.map((area, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <span className="text-slate-700 font-medium">{area}</span>
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Question-by-Question Review</span>
          </h3>
          
          <div className="space-y-6">
            {testResult.questions.map((question, index) => {
              const userAnswer = testResult.userAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className={`p-6 min-[350px]:p-4 rounded-lg border-2 ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 min-[350px]:w-8 min-[350px]:h-6 rounded-full flex items-center justify-center font-bold text-white ${
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
                          <div className="flex items-center justify-between min-[350px]:flex-col">
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
        <div className="flex flex-wrap justify-center space-x-4">
          <button
            onClick={handleBackToTheory}
            className="flex items-center justify-center space-x-2 px-6 my-1 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Theory</span>
          </button>
          
          <button
            onClick={resetQuiz}
            className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 my-1 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Retake Assessment</span>
          </button>
          
          <button
            onClick={handleBackToCourse}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 my-1 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span>Continue Course</span>
          </button>
        </div>
      </div>
    );
  }
  
  return null;
};

export default TheoryQuizSession;


