// import React, {useRef, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Brain, Target, Calendar, BookOpen, CheckCircle, ArrowRight, Award, Zap, Rocket, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
// import { useAuth } from '../../hooks/useAuth';
// import { useSettings } from '../../hooks/useSettings';
// import LoadingSpinner from '../Common/LoadingSpinner';
// import { useNotification } from '../../context/NotificationContext';

// const OnboardingSetup: React.FC = () => {
//   const { user, updateProfile, loading: authLoading } = useAuth();
//   const { updateSettings, loading: settingsLoading } = useSettings();
//   const navigate = useNavigate();
//   const { showSuccess, showError } = useNotification();

//   const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

//   // Add error boundary state
//   const [hasError, setHasError] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [studyPlanLoading, setStudyPlanLoading] = useState(false);


//   // Add useEffect to catch any initialization errors
//   useEffect(() => {
//     try {
//       console.log('OnboardingSetup mounted with user:', user);
//       console.log('Auth loading:', authLoading);
//       console.log('Settings loading:', settingsLoading);
      
//       // Check if we have the required dependencies
//       if (!showSuccess || !showError) {
//         throw new Error('Notification context not available');
//       }
      
//       if (!navigate) {
//         throw new Error('Navigation context not available');
//       }
      
//     } catch (error) {
//       console.error('Error during OnboardingSetup initialization:', error);
//       setHasError(true);
//       setErrorMessage(error instanceof Error ? error.message : 'Unknown initialization error');
//     }
//   }, [user, authLoading, settingsLoading, showSuccess, showError, navigate]);

//   // Show error state if initialization failed
//   if (hasError) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <AlertTriangle className="w-8 h-8 text-red-600" />
//           </div>
//           <h2 className="text-2xl font-bold text-slate-800 mb-4">Setup Error</h2>
//           <p className="text-slate-600 mb-6">{errorMessage}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
//           >
//             Reload Page
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedExam, setSelectedExam] = useState('');
//   const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
//   const [subjects, setSubjects] = useState<string[]>([]);
//   const [dailyHours, setDailyHours] = useState(6);
//   const [targetDate, setTargetDate] = useState('');
//   const [currentLevel, setCurrentLevel] = useState('intermediate');
//   const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
//   const [preferredStudyTime, setPreferredStudyTime] = useState('morning');
//   const [learningStyle, setLearningStyle] = useState('mixed');
//   const [contentPreference, setContentPreference] = useState('balanced');
//   const [motivationLevel, setMotivationLevel] = useState('high');
//   const [commonDistractions, setCommonDistractions] = useState<string[]>([]);
//   const [shortTermGoal, setShortTermGoal] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);



//   // Add a check for notification context readiness
//   if (!showSuccess || !showError) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
//         <LoadingSpinner message="Initializing application..." variant="brain" />
//       </div>
//     );
//   }

  
  
//   const examTypes = [
//     'UPSC Civil Services',
//     'SSC CGL',
//     'Banking (SBI PO/Clerk)',
//     'JEE Main/Advanced',
//     'NEET',
//     'CAT',
//     'GATE',
//     'Board Exams (Class 12)',
//     'University Exams',
//   ];

//   const learningStyles = [
//     { value: 'visual', label: 'Visual Learner', desc: 'Learn best with diagrams, charts, and visual aids' },
//     { value: 'auditory', label: 'Auditory Learner', desc: 'Learn best through listening and discussion' },
//     { value: 'kinesthetic', label: 'Kinesthetic Learner', desc: 'Learn best through hands-on practice and movement' },
//     { value: 'mixed', label: 'Mixed Learning Style', desc: 'Combination of different learning approaches' }
//   ];

//   const contentPreferences = [
//     { value: 'theory-heavy', label: 'Theory Heavy', desc: 'Prefer detailed theoretical explanations' },
//     { value: 'practice-heavy', label: 'Practice Heavy', desc: 'Prefer more problem-solving and practice' },
//     { value: 'balanced', label: 'Balanced Approach', desc: 'Equal mix of theory and practice' },
//     { value: 'example-driven', label: 'Example Driven', desc: 'Learn best through examples and case studies' }
//   ];

//   const motivationLevels = [
//     { value: 'high', label: 'High Motivation', desc: 'Very determined and self-driven' },
//     { value: 'medium', label: 'Medium Motivation', desc: 'Generally motivated but need occasional push' },
//     { value: 'low', label: 'Need Motivation', desc: 'Require regular encouragement and support' }
//   ];

//   const commonDistractionsOptions = [
//     'Social Media', 'Mobile Phone', 'TV/Entertainment', 'Friends/Family', 
//     'Internet Browsing', 'Gaming', 'Procrastination', 'Fatigue'
//   ];

//   const subjectOptions: { [key: string]: string[] } = {
//     'UPSC Civil Services': ['History', 'Geography', 'Polity', 'Economics', 'Current Affairs', 'Ethics', 'Public Administration'],
//     'SSC CGL': ['Quantitative Aptitude', 'English', 'General Intelligence', 'General Awareness'],
//     'Banking (SBI PO/Clerk)': ['Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness', 'Computer Knowledge'],
//     'JEE Main/Advanced': ['Physics', 'Chemistry', 'Mathematics'],
//     'NEET': ['Physics', 'Chemistry', 'Biology'],
//     'CAT': ['Quantitative Ability', 'Verbal Ability', 'Data Interpretation', 'Logical Reasoning'],
//     'GATE': ['Engineering Mathematics', 'TBD Technical Subject', 'General Aptitude'],
//     'Board Exams (Class 12)': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'],
//     'University Exams': ['Core Subjects', 'Electives', 'Practical', 'Project Work'],
//   };

//   useEffect(() => {
//     // Pre-fill selected exam from localStorage if available (from GetStartedPage)
//     const storedExam = localStorage.getItem('selectedExam');
//     if (storedExam) {
//       setSelectedExam(storedExam);
//       localStorage.removeItem('selectedExam'); // Clear after use
//     }
//   }, []);

//   const handleSubjectToggle = (subject: string) => {
//     setSubjects(prev => 
//       prev.includes(subject) 
//         ? prev.filter(s => s !== subject)
//         : [...prev, subject]
//     );
//   };

//   const handleWeakSubjectToggle = (subject: string) => {
//     setWeakSubjects(prev => 
//       prev.includes(subject) 
//         ? prev.filter(s => s !== subject)
//         : [...prev, subject]
//     );
//   };

//   const handleDistractionToggle = (distraction: string) => {
//     setCommonDistractions(prev => 
//       prev.includes(distraction) 
//         ? prev.filter(d => d !== distraction)
//         : [...prev, distraction]
//     );
//   };

//   const handleNextStep = async () => {
//     if (currentStep === 1) {
//       if (!selectedExam) {
//         showError('Selection Required', 'Please select your target exam.');
//         return;
//       }
//       setCurrentStep(2);
//     } else if (currentStep === 2) {
//       if (subjects.length === 0 || !targetDate) {
//         showError('Missing Information', 'Please select at least one subject and a target date.');
//         return;
//       }
//       setCurrentStep(3);
//     } else if (currentStep === 3) {
//       // Learning style preferences are optional, so we can proceed
//       setCurrentStep(4);
//     } else if (currentStep === 4) {
//       if (!shortTermGoal.trim()) {
//         showError('Missing Information', 'Please enter your short-term goal.');
//         return;
//       }
//       setIsProcessing(true);
//       try {
//         try {
//           // Update user profile with selected exam
//           console.log('Updating user profile with exam:', selectedExam);
//             // Save onboarding preferences to settings
//           console.log('Profile updated successfully');
//             const studentProfile = {
//         selectedExam,
//         subjects,
//         dailyHours,
//         targetDate,
//         currentLevel,
//         weakSubjects,
//         preferredStudyTime,
//         learningStyle,
//         contentPreference,
//         motivationLevel,
//         commonDistractions,
//         shortTermGoal,
//       };
          
//             // console.log('OnboardingSetup: Saving preferences to settings:', onboardingPreferences);

//           await updateProfile({ target_exam: selectedExam });

//             // Save preferences to user settings
//             await updateSettings(studentProfile);
//             console.log('Preferences saved successfully');
//           console.log('Generating study plan with profile:', studentProfile);
//             showSuccess('Onboarding Complete!', 'Your preferences have been saved. Redirecting to dashboard...');
//           console.log('Study plan generated successfully');
          
//           showSuccess('Onboarding Complete!', 'Your personalized study plan is ready. Redirecting to dashboard...');
//           setIsProcessing(false);
//           setTimeout(() => {
//             navigate('/app/dashboard'); // Redirect to dashboard after successful onboarding
//           }, 2000);
//         } catch (profileError) {
//           console.error('Error during profile update:', profileError);
//           setIsProcessing(false);

//           if (profileError instanceof Error) {
//             showError('Database Error', 'There was an issue saving your preferences. Please try again in a moment.', `Setup failed: ${profileError.message}`);
//             setTimeout(() => {
//               navigate('/app/dashboard');
//             }, 3000);
//           } else {
//             showError('Onboarding Error', 'Setup failed. Please try again or contact support.');
//           }
//         }
//       } catch (error) {
//         // This catch block handles any errors not caught by the inner try-catch
//         console.error('Unexpected error during onboarding:', error);
//         showError('Critical Error', 'A critical error occurred. Please refresh the page and try again.');
//         setIsProcessing(false);
//       }
//     }
//   };

//   const handlePreviousStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };
//   if (authLoading || !user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
//         <LoadingSpinner message="Loading user data..." variant="brain" />
//       </div>
//     );
//   }

//   const stepsContent = [
//     {
//       step: 1,
//       title: "Step 1: Choose Your Exam",
//       description: "Select the competitive exam you are preparing for. This helps our AI tailor your study plan.",
//       icon: Target,
//       content: (
//         <div className="space-y-4">
//           <label className="block text-sm font-medium text-slate-700 mb-2">
//             Target Exam *
//           </label>
//           <select
//             value={selectedExam}
//             onChange={(e) => setSelectedExam(e.target.value)}
//             className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
//           >
//             <option value="">Select your target exam</option>
//             {examTypes.map(exam => (
//               <option key={exam} value={exam}>{exam}</option>
//             ))}
//           </select>
//         </div>
//       ),
//       buttonText: "Next: Personalize Plan"
//     },
//     {
//       step: 2,
//       title: "Step 2: Personalize Your Plan",
//       description: "Tell us more about your study preferences to create an optimal learning strategy.",
//       icon: Calendar,
//       content: (
//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Daily Study Hours: {dailyHours}h
//             </label>
//             <input
//               type="range"
//               min="2"
//               max="12"
//               value={dailyHours}
//               onChange={(e) => setDailyHours(parseInt(e.target.value))}
//               className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
//             />
//             <div className="flex justify-between text-xs text-slate-500 mt-1">
//               <span>2h</span>
//               <span>6h</span>
//               <span>12h</span>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Target Exam Date *
//             </label>
//             <input
//               type="date"
//               value={targetDate}
//               onChange={(e) => setTargetDate(e.target.value)}
//               min={new Date().toISOString().split('T')[0]}
//               className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Current Preparation Level
//             </label>
//             <select
//               value={currentLevel}
//               onChange={(e) => setCurrentLevel(e.target.value)}
//               className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
//             >
//               <option value="beginner">Beginner (Just started)</option>
//               <option value="intermediate">Intermediate (Some preparation done)</option>
//               <option value="advanced">Advanced (Well-prepared, need optimization)</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Preferred Study Time
//             </label>
//             <select
//               value={preferredStudyTime}
//               onChange={(e) => setPreferredStudyTime(e.target.value)}
//               className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
//             >
//               <option value="early-morning">Early Morning (4-8 AM)</option>
//               <option value="morning">Morning (8-12 PM)</option>
//               <option value="afternoon">Afternoon (12-6 PM)</option>
//               <option value="evening">Evening (6-10 PM)</option>
//               <option value="night">Night (10 PM-2 AM)</option>
//               <option value="flexible">Flexible (Anytime)</option>
//             </select>
//           </div>

//           {selectedExam && subjectOptions[selectedExam] && (
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Select Subjects *
//               </label>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                 {(subjectOptions[selectedExam] || []).map(subject => (
//                   <button
//                     key={subject}
//                     onClick={() => handleSubjectToggle(subject)}
//                     className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
//                       subjects.includes(subject)
//                         ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
//                         : 'border-slate-200 hover:border-slate-300 text-slate-700'
//                     }`}
//                   >
//                     {subject}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {subjects.length > 0 && (
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Identify Weak Subjects (Optional)
//               </label>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                 {subjects.map(subject => (
//                   <button
//                     key={subject}
//                     onClick={() => handleWeakSubjectToggle(subject)}
//                     className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
//                       weakSubjects.includes(subject)
//                         ? 'border-orange-500 bg-orange-50 text-orange-800'
//                         : 'border-slate-200 hover:border-slate-300 text-slate-700'
//                     }`}
//                   >
//                     {subject}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       ),
//       buttonText: "Next: Learning Preferences"
//     },
//     {
//       step: 3,
//       title: "Step 3: Learning Style Preferences",
//       description: "Help us understand how you learn best so we can optimize your study experience.",
//       icon: Brain,
//       content: (
//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-4">
//               What's your learning style?
//             </label>
//             <div className="space-y-3">
//               {learningStyles.map(style => (
//                 <button
//                   key={style.value}
//                   onClick={() => setLearningStyle(style.value)}
//                   className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
//                     learningStyle === style.value
//                       ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
//                       : 'border-slate-200 hover:border-slate-300 text-slate-700'
//                   }`}
//                 >
//                   <div className="font-medium">{style.label}</div>
//                   <div className="text-sm text-slate-600 mt-1">{style.desc}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-4">
//               Content preference for study materials
//             </label>
//             <div className="space-y-3">
//               {contentPreferences.map(pref => (
//                 <button
//                   key={pref.value}
//                   onClick={() => setContentPreference(pref.value)}
//                   className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
//                     contentPreference === pref.value
//                       ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
//                       : 'border-slate-200 hover:border-slate-300 text-slate-700'
//                   }`}
//                 >
//                   <div className="font-medium">{pref.label}</div>
//                   <div className="text-sm text-slate-600 mt-1">{pref.desc}</div>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       ),
//       buttonText: "Next: Study Habits"
//     },
//     {
//       step: 4,
//       title: "Step 4: Study Habits & Goals",
//       description: "Final step! Tell us about your study habits and goals to complete your personalized profile.",
//       icon: Target,
//       content: (
//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-4">
//               How would you describe your motivation level?
//             </label>
//             <div className="space-y-3">
//               {motivationLevels.map(level => (
//                 <button
//                   key={level.value}
//                   onClick={() => setMotivationLevel(level.value)}
//                   className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
//                     motivationLevel === level.value
//                       ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
//                       : 'border-slate-200 hover:border-slate-300 text-slate-700'
//                   }`}
//                 >
//                   <div className="font-medium">{level.label}</div>
//                   <div className="text-sm text-slate-600 mt-1">{level.desc}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-4">
//               What are your common distractions? (Select all that apply)
//             </label>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//               {commonDistractionsOptions.map(distraction => (
//                 <button
//                   key={distraction}
//                   onClick={() => handleDistractionToggle(distraction)}
//                   className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
//                     commonDistractions.includes(distraction)
//                       ? 'border-orange-500 bg-orange-50 text-orange-800'
//                       : 'border-slate-200 hover:border-slate-300 text-slate-700'
//                   }`}
//                 >
//                   {distraction}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               What's your primary short-term goal? *
//             </label>
//             <textarea
//               value={shortTermGoal}
//               onChange={(e) => setShortTermGoal(e.target.value)}
//               placeholder="e.g., Clear the exam in first attempt, Improve weak subjects, Build consistent study habits..."
//               className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               rows={3}
//             />
//           </div>
//         </div>
//       ),
//       buttonText: "Generate My Study Plan"
//     }
//   ];

//   const currentStepData = stepsContent[currentStep - 1];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 lg:p-8">
//       <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 w-full max-w-2xl">
//         {/* Progress Indicator */}
//         <div className="flex items-center justify-center mb-8">
//           <div className="flex items-center space-x-4 max[400px]:space-x-1">
//             {stepsContent.map((step, index) => (
//               <React.Fragment key={step.step}>
//                 <div className={`flex items-center space-x-2 ${
//                   currentStep >= step.step ? 'opacity-100' : 'opacity-50'
//                 }`}>
//                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
//                     currentStep >= step.step 
//                       ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
//                       : 'bg-slate-300'
//                   }`}>
//                     {currentStep > step.step ? (
//                       <CheckCircle className="w-6 h-6" />
//                     ) : (
//                       step.step
//                     )}
//                   </div>
//                   <div className="hidden lg:block">
//                     <div className="font-medium text-slate-800">{step.title.replace('Step ', '').replace(/^\d+:\s*/, '')}</div>
//                   </div>
//                 </div>
//                 {index < stepsContent.length - 1 && (
//                   <div className={`w-8 h-1 rounded-full ${
//                     currentStep > step.step ? 'bg-blue-500' : 'bg-slate-300'
//                   }`} />
//                 )}
//               </React.Fragment>
//             ))}
//           </div>
//         </div>

//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center space-x-2 mb-4">
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//               <Brain className="w-6 h-6 text-white" />
//             </div>
//             <span className="text-xl lg:text-2xl font-bold text-slate-800">EduAI</span>
//           </div>
//           <h2 className="text-lg lg:text-xl font-semibold text-slate-700">
//             {currentStepData.title}
//           </h2>
//           <p className="text-slate-500 mt-2 text-sm lg:text-base">
//             {currentStepData.description}
//           </p>
//         </div>

//         {isProcessing || studyPlanLoading ? (
//           <div className="text-center py-12">
//             <LoadingSpinner message="Generating your personalized study plan..." variant="brain" />
//             <div className="mt-6 space-y-2">
//               <div className="text-sm text-slate-600">✨ Analyzing your preferences...</div>
//               <div className="text-sm text-slate-600">🧠 Creating AI-powered study strategy...</div>
//               <div className="text-sm text-slate-600">📅 Building your personalized schedule...</div>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="mb-6">
//               {currentStepData.content}
//             </div>

//             {isProcessing || settingsLoading ? (
//               <div className="text-center py-8">
//                 <LoadingSpinner message="Saving your preferences..." variant="brain" />
//                 <div className="mt-6 space-y-2">
//                   <div className="text-sm text-slate-600">✨ Saving your learning preferences...</div>
//                   <div className="text-sm text-slate-600">🧠 Preparing your personalized experience...</div>
//                   <div className="text-sm text-slate-600">📅 Setting up your profile...</div>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex justify-between items-center">
//                 {currentStep > 1 && !isProcessing && (
//                   <button
//                     onClick={handlePreviousStep}
//                     className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
//                   >
//                     Previous
//                   </button>
//                 )}
//                 <button
//                   onClick={handleNextStep}
//                   className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${currentStep === 1 ? 'ml-auto' : ''}`}
//                   disabled={
//                     (currentStep === 1 && !selectedExam) ||
//                     (currentStep === 2 && (subjects.length === 0 || !targetDate)) ||
//                     (currentStep === 4 && !shortTermGoal.trim()) ||
//                     isProcessing
//                   }
//                 >
//                   <span>{currentStepData.buttonText}</span>
//                   {!isProcessing && <ArrowRight className="w-5 h-5" />}
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OnboardingSetup;





import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Brain, Target, Calendar, BookOpen, CheckCircle, ArrowRight, Award, Zap, Rocket, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../hooks/useSettings';
import LoadingSpinner from '../Common/LoadingSpinner';
import { useNotification } from '../../context/NotificationContext';


const OnboardingSetup: React.FC = () => {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const { updateSettings, loading: settingsLoading } = useSettings();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  // Create refs for each step's content div
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Add error boundary state
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [studyPlanLoading, setStudyPlanLoading] = useState(false);


  // Add useEffect to catch any initialization errors
  useEffect(() => {
    try {
      console.log('OnboardingSetup mounted with user:', user);
      console.log('Auth loading:', authLoading);
      console.log('Settings loading:', settingsLoading);
      
      // Check if we have the required dependencies
      if (!showSuccess || !showError) {
        throw new Error('Notification context not available');
      }
      
      if (!navigate) {
        throw new Error('Navigation context not available');
      }
      
    } catch (error) {
      console.error('Error during OnboardingSetup initialization:', error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown initialization error');
    }
  }, [user, authLoading, settingsLoading, showSuccess, showError, navigate]);

  // Show error state if initialization failed
  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Setup Error</h2>
          <p className="text-slate-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedExam, setSelectedExam] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [dailyHours, setDailyHours] = useState(6);
  const [targetDate, setTargetDate] = useState('');
  const [currentLevel, setCurrentLevel] = useState('intermediate');
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
  const [preferredStudyTime, setPreferredStudyTime] = useState('morning');
  const [learningStyle, setLearningStyle] = useState('mixed');
  const [contentPreference, setContentPreference] = useState('balanced');
  const [motivationLevel, setMotivationLevel] = useState('high');
  const [commonDistractions, setCommonDistractions] = useState<string[]>([]);
  const [shortTermGoal, setShortTermGoal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);


  // Effect to scroll to the current step when it changes
  useEffect(() => {
    if (stepRefs.current[currentStep - 1]) {
      stepRefs.current[currentStep - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      stepRefs.current[currentStep - 1]?.focus(); // Focus the element for accessibility
    }
  }, [currentStep]);
  
  
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

  const learningStyles = [
    { value: 'visual', label: 'Visual Learner', desc: 'Learn best with diagrams, charts, and visual aids' },
    { value: 'auditory', label: 'Auditory Learner', desc: 'Learn best through listening and discussion' },
    { value: 'kinesthetic', label: 'Kinesthetic Learner', desc: 'Learn best through hands-on practice and movement' },
    { value: 'mixed', label: 'Mixed Learning Style', desc: 'Combination of different learning approaches' }
  ];

  const contentPreferences = [
    { value: 'theory-heavy', label: 'Theory Heavy', desc: 'Prefer detailed theoretical explanations' },
    { value: 'practice-heavy', label: 'Practice Heavy', desc: 'Prefer more problem-solving and practice' },
    { value: 'balanced', label: 'Balanced Approach', desc: 'Equal mix of theory and practice' },
    { value: 'example-driven', label: 'Example Driven', desc: 'Learn best through examples and case studies' }
  ];

  const motivationLevels = [
    { value: 'high', label: 'High Motivation', desc: 'Very determined and self-driven' },
    { value: 'medium', label: 'Medium Motivation', desc: 'Generally motivated but need occasional push' },
    { value: 'low', label: 'Need Motivation', desc: 'Require regular encouragement and support' }
  ];

  const commonDistractionsOptions = [
    'Social Media', 'Mobile Phone', 'TV/Entertainment', 'Friends/Family', 
    'Internet Browsing', 'Gaming', 'Procrastination', 'Fatigue'
  ];

  const subjectOptions: { [key: string]: string[] } = {
    'UPSC Civil Services': ['History', 'Geography', 'Polity', 'Economics', 'Current Affairs', 'Ethics', 'Public Administration'],
    'SSC CGL': ['Quantitative Aptitude', 'English', 'General Intelligence', 'General Awareness'],
    'Banking (SBI PO/Clerk)': ['Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness', 'Computer Knowledge'],
    'JEE Main/Advanced': ['Physics', 'Chemistry', 'Mathematics'],
    'NEET': ['Physics', 'Chemistry', 'Biology'],
    'CAT': ['Quantitative Ability', 'Verbal Ability', 'Data Interpretation', 'Logical Reasoning'],
    'GATE': ['Engineering Mathematics', 'TBD Technical Subject', 'General Aptitude'],
    'Board Exams (Class 12)': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'],
    'University Exams': ['Core Subjects', 'Electives', 'Practical', 'Project Work'],
  };

  useEffect(() => {
    // Pre-fill selected exam from localStorage if available (from GetStartedPage)
    const storedExam = localStorage.getItem('selectedExam');
    if (storedExam) {
      setSelectedExam(storedExam);
      localStorage.removeItem('selectedExam'); // Clear after use
    }
  }, []);

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

  const handleDistractionToggle = (distraction: string) => {
    setCommonDistractions(prev => 
      prev.includes(distraction) 
        ? prev.filter(d => d !== distraction)
        : [...prev, distraction]
    );
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (!selectedExam) {
        showError('Selection Required', 'Please select your target exam.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (subjects.length === 0 || !targetDate) {
        showError('Missing Information', 'Please select at least one subject and a target date.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Learning style preferences are optional, so we can proceed
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!shortTermGoal.trim()) {
        showError('Missing Information', 'Please enter your short-term goal.');
        return;
      }
      setIsProcessing(true);
      try {
        try {
          // Update user profile with selected exam
          console.log('Updating user profile with exam:', selectedExam);
            // Save onboarding preferences to settings
          console.log('Profile updated successfully');
            const studentProfile = {
        selectedExam,
        subjects,
        dailyHours,
        targetDate,
        currentLevel,
        weakSubjects,
        preferredStudyTime,
        learningStyle,
        contentPreference,
        motivationLevel,
        commonDistractions,
        shortTermGoal,
      };
          
            // console.log('OnboardingSetup: Saving preferences to settings:', onboardingPreferences);

          await updateProfile({ target_exam: selectedExam });

            // Save preferences to user settings
            await updateSettings(studentProfile);
            console.log('Preferences saved successfully');
          console.log('Generating study plan with profile:', studentProfile);
            showSuccess('Onboarding Complete!', 'Your preferences have been saved. Redirecting to dashboard...');
          console.log('Study plan generated successfully');


          await updateProfile({ target_exam: selectedExam });
await updateSettings(studentProfile);
          await user?.reload?.();
          
          showSuccess('Onboarding Complete!', 'Your personalized study plan is ready. Redirecting to dashboard...');
          setIsProcessing(false);
          setTimeout(() => {
            navigate('/app/dashboard'); // Redirect to dashboard after successful onboarding
          }, 2000);
        } catch (profileError) {
          console.error('Error during profile update:', profileError);
          setIsProcessing(false);

          if (profileError instanceof Error) {
            showError('Database Error', 'There was an issue saving your preferences. Please try again in a moment.', `Setup failed: ${profileError.message}`);
            setTimeout(() => {
              navigate('/app/dashboard');
            }, 3000);
          } else {
            showError('Onboarding Error', 'Setup failed. Please try again or contact support.');
          }
        }
      } catch (error) {
        // This catch block handles any errors not caught by the inner try-catch
        console.error('Unexpected error during onboarding:', error);
        showError('Critical Error', 'A critical error occurred. Please refresh the page and try again.');
        setIsProcessing(false);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <LoadingSpinner message="Loading user data..." variant="brain" />
      </div>
    );
  }

  const stepsContent = [
    {
      step: 1,
      title: "Step 1: Choose Your Exam",
      description: "Select the competitive exam you are preparing for. This helps our AI tailor your study plan.",
      icon: Target,
      content: (
        <div ref={el => stepRefs.current[0] = el} tabIndex={-1} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Target Exam *
          </label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
          >
            <option value="">Select your target exam</option>
            {examTypes.map(exam => (
              <option key={exam} value={exam}>{exam}</option>
            ))}
          </select>
        </div>
      ),
      buttonText: "Next: Personalize Plan"
    },
    {
      step: 2,
      title: "Step 2: Personalize Your Plan",
      description: "Tell us more about your study preferences to create an optimal learning strategy.",
      icon: Calendar,
      content: (
        <div ref={el => stepRefs.current[1] = el} tabIndex={-1} className="space-y-6">
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Target Exam Date *
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Current Preparation Level
            </label>
            <select
              value={currentLevel}
              onChange={(e) => setCurrentLevel(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
            >
              <option value="beginner">Beginner (Just started)</option>
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
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
            >
              <option value="early-morning">Early Morning (4-8 AM)</option>
              <option value="morning">Morning (8-12 PM)</option>
              <option value="afternoon">Afternoon (12-6 PM)</option>
              <option value="evening">Evening (6-10 PM)</option>
              <option value="night">Night (10 PM-2 AM)</option>
              <option value="flexible">Flexible (Anytime)</option>
            </select>
          </div>

          {selectedExam && subjectOptions[selectedExam] && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Subjects *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(subjectOptions[selectedExam] || []).map(subject => (
                  <button
                    key={subject}
                    onClick={() => handleSubjectToggle(subject)}
                    className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
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

          {subjects.length > 0 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Identify Weak Subjects (Optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {subjects.map(subject => (
                  <button
                    key={subject}
                    onClick={() => handleWeakSubjectToggle(subject)}
                    className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
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
        </div>
      ),
      buttonText: "Next: Learning Preferences"
    },
    {
      step: 3,
      title: "Step 3: Learning Style Preferences",
      description: "Help us understand how you learn best so we can optimize your study experience.",
      icon: Brain,
      content: (
        <div ref={el => stepRefs.current[2] = el} tabIndex={-1} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-4">
              What's your learning style?
            </label>
            <div className="space-y-3">
              {learningStyles.map(style => (
                <button
                  key={style.value}
                  onClick={() => setLearningStyle(style.value)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    learningStyle === style.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-medium">{style.label}</div>
                  <div className="text-sm text-slate-600 mt-1">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-4">
              Content preference for study materials
            </label>
            <div className="space-y-3">
              {contentPreferences.map(pref => (
                <button
                  key={pref.value}
                  onClick={() => setContentPreference(pref.value)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    contentPreference === pref.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-medium">{pref.label}</div>
                  <div className="text-sm text-slate-600 mt-1">{pref.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
      buttonText: "Next: Study Habits"
    },
    {
      step: 4,
      title: "Step 4: Study Habits & Goals",
      description: "Final step! Tell us about your study habits and goals to complete your personalized profile.",
      icon: Target,
      content: (
        <div ref={el => stepRefs.current[3] = el} tabIndex={-1} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-4">
              How would you describe your motivation level?
            </label>
            <div className="space-y-3">
              {motivationLevels.map(level => (
                <button
                  key={level.value}
                  onClick={() => setMotivationLevel(level.value)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    motivationLevel === level.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-medium">{level.label}</div>
                  <div className="text-sm text-slate-600 mt-1">{level.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-4">
              What are your common distractions? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {commonDistractionsOptions.map(distraction => (
                <button
                  key={distraction}
                  onClick={() => handleDistractionToggle(distraction)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    commonDistractions.includes(distraction)
                      ? 'border-orange-500 bg-orange-50 text-orange-800'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  {distraction}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              What's your primary short-term goal? *
            </label>
            <textarea
              value={shortTermGoal}
              onChange={(e) => setShortTermGoal(e.target.value)}
              placeholder="e.g., Clear the exam in first attempt, Improve weak subjects, Build consistent study habits..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
            />
          </div>
        </div>
      ),
      buttonText: "Generate My Study Plan"
    }
  ];

  const currentStepData = stepsContent[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 lg:p-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4 max[400px]:space-x-1">
            {stepsContent.map((step, index) => (
              <React.Fragment key={step.step}>
                <div className={`flex items-center space-x-2 ${
                  currentStep >= step.step ? 'opacity-100' : 'opacity-50'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    currentStep >= step.step 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                      : 'bg-slate-300'
                  }`}>
                    {currentStep > step.step ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step.step
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <div className="font-medium text-slate-800">{step.title.replace('Step ', '').replace(/^\d+:\s*/, '')}</div>
                  </div>
                </div>
                {index < stepsContent.length - 1 && (
                  <div className={`w-8 h-1 rounded-full ${
                    currentStep > step.step ? 'bg-blue-500' : 'bg-slate-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl lg:text-2xl font-bold text-slate-800">EduAI</span>
          </div>
          <h2 className="text-lg lg:text-xl font-semibold text-slate-700">
            {currentStepData.title}
          </h2>
          <p className="text-slate-500 mt-2 text-sm lg:text-base">
            {currentStepData.description}
          </p>
        </div>

        {isProcessing || studyPlanLoading ? (
          <div className="text-center py-12">
            <LoadingSpinner message="Generating your personalized study plan..." variant="brain" />
            <div className="mt-6 space-y-2">
              <div className="text-sm text-slate-600">✨ Analyzing your preferences...</div>
              <div className="text-sm text-slate-600">🧠 Creating AI-powered study strategy...</div>
              <div className="text-sm text-slate-600">📅 Building your personalized schedule...</div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              {currentStepData.content}
            </div>

            {isProcessing || settingsLoading ? (
              <div className="text-center py-8">
                <LoadingSpinner message="Saving your preferences..." variant="brain" />
                <div className="mt-6 space-y-2">
                  <div className="text-sm text-slate-600">✨ Saving your learning preferences...</div>
                  <div className="text-sm text-slate-600">🧠 Preparing your personalized experience...</div>
                  <div className="text-sm text-slate-600">📅 Setting up your profile...</div>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                {currentStep > 1 && !isProcessing && (
                  <button
                    onClick={handlePreviousStep}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={handleNextStep}
                  className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${currentStep === 1 ? 'ml-auto' : ''}`}
                  disabled={
                    (currentStep === 1 && !selectedExam) ||
                    (currentStep === 2 && (subjects.length === 0 || !targetDate)) ||
                    (currentStep === 4 && !shortTermGoal.trim()) ||
                    isProcessing
                  }
                >
                  <span>{currentStepData.buttonText}</span>
                  {!isProcessing && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingSetup;
