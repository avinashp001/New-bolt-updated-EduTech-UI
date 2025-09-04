import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { 
  Play, 
  CheckCircle, 
  ArrowRight, 
  Brain, 
  Target, 
  BarChart3, 
  Clock, 
  BookOpen,
  Upload,
  Calendar,
  Award,
  Users,
  Zap,
  Star,
  TrendingUp,
  Shield,
  HelpCircle,
  Lightbulb,
  Rocket,
  ChevronRight,
  ChevronLeft,
  Eye,
  Download,
  Settings,
  MessageSquare
} from 'lucide-react';
import SEOHead from '../SEO/SEOHead';

const HowToUsePage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const sectionRefs = {
    'getting-started': useRef<HTMLDivElement | null>(null),
    'study-planning': useRef<HTMLDivElement | null>(null),
    'ai-features': useRef<HTMLDivElement | null>(null),
    'analytics': useRef<HTMLDivElement | null>(null),
    'advanced': useRef<HTMLDivElement | null>(null),
  };
  
  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: Rocket },
    { id: 'study-planning', name: 'Study Planning', icon: Calendar },
    { id: 'ai-features', name: 'AI Features', icon: Brain },
    { id: 'analytics', name: 'Analytics & Tracking', icon: BarChart3 },
    { id: 'advanced', name: 'Advanced Features', icon: Settings }
  ];

  const location = useLocation();
  useEffect(() => {
  if (location.hash) {
    const id = location.hash.replace("#", "");

    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        const yOffset = -80; // adjust for sticky navbar height
        const y =
          section.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 200); // ⏳ give render a bit more time
  }
}, [location]);


  const gettingStartedSteps = [
    {
      title: "Sign Up & Create Your Profile",
      description: "Create your EduAI account and set up your personalized learning profile",
      image: "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800",
      steps: [
        "Click 'Sign Up' on the homepage",
        "Enter your email and create a secure password",
        "Verify your email address",
        "Complete your profile with target exam and study preferences",
        "Take the initial assessment to calibrate AI recommendations"
      ],
      tips: [
        "Use a strong password for account security",
        "Verify your email to unlock all features",
        "Be honest in your initial assessment for better AI recommendations"
      ]
    },
    {
      title: "Select Your Target Exam",
      description: "Choose your competitive exam and let AI customize your entire learning experience",
      image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800",
      steps: [
        "Navigate to 'Settings' from the sidebar",
        "Select your target exam from the dropdown",
        "Choose your current preparation level",
        "Set your target exam date",
        "Confirm your subject preferences"
      ],
      tips: [
        "Select the most specific exam variant for better customization",
        "Set a realistic target date for optimal study planning",
        "Update your exam selection if your goals change"
      ]
    },
    {
      title: "Generate Your AI Study Plan",
      description: "Let our AI create a personalized study plan based on your profile and exam requirements",
      image: "https://images.pexels.com/photos/5428010/pexels-photo-5428010.jpeg?auto=compress&cs=tinysrgb&w=800",
      steps: [
        "Go to 'AI Schedule' in the sidebar",
        "Review your exam and profile information",
        "Set your daily available study hours",
        "Select subjects you find challenging",
        "Click 'Generate Topper's Strategy Plan'",
        "Review and customize your generated plan"
      ],
      tips: [
        "Be realistic about your daily available hours",
        "Mark subjects you struggle with for extra focus",
        "Review the plan weekly and adjust as needed"
      ]
    }
  ];

  const studyPlanningSteps = [
    {
      title: "Daily Study Schedule",
      description: "Follow your AI-generated daily schedule for optimal learning progression",
      image: "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=800",
      steps: [
        "Check your daily schedule on the dashboard",
        "Start with the highest priority subject",
        "Follow the recommended time slots",
        "Take breaks as suggested by the AI",
        "Mark topics as completed after studying"
      ],
      tips: [
        "Stick to your schedule for best results",
        "Adjust timing based on your energy levels",
        "Use the study timer for focused sessions"
      ]
    },
    {
      title: "Weekly Progress Tracking",
      description: "Monitor your weekly progress and adjust your study strategy accordingly",
      image: "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800",
      steps: [
        "Visit 'Weekly Task Assessment' page",
        "Upload study materials for the week",
        "Take the AI-generated assessment",
        "Review your performance analysis",
        "Implement the recommended improvements"
      ],
      tips: [
        "Take assessments honestly for accurate feedback",
        "Focus on weak areas identified by AI",
        "Celebrate your improvements and milestones"
      ]
    }
  ];

  const aiFeatureSteps = [
    {
      title: "AI Mentor Chat",
      description: "Get personalized guidance from Dr. Rajesh Kumar, your AI mentor with 15+ years of experience",
      image: "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800",
      steps: [
        "Navigate to 'AI Mentor' in the sidebar",
        "Select your target exam if not already set",
        "Upload study materials for content analysis (optional)",
        "Ask specific questions about your studies",
        "Get comprehensive analysis and strategy recommendations"
      ],
      tips: [
        "Be specific in your questions for better guidance",
        "Upload relevant study materials for context-aware responses",
        "Use the quick action buttons for common queries"
      ]
    },
    {
      title: "AI Performance Analysis",
      description: "Upload study materials and get AI-generated tests with detailed performance analysis",
      image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800",
      steps: [
        "Go to 'AI Self Assessment' page",
        "Select the subject you want to test",
        "Upload your study material (PDF, DOC, TXT)",
        "Take the AI-generated test based on your content",
        "Review detailed performance analysis and recommendations"
      ],
      tips: [
        "Upload high-quality, relevant study materials",
        "Take tests in a distraction-free environment",
        "Review the analysis thoroughly and implement suggestions"
      ]
    }
  ];

  const analyticsSteps = [
    {
      title: "Real-Time Analytics Dashboard",
      description: "Monitor your study progress with comprehensive analytics and insights",
      image: "https://images.pexels.com/photos/5428010/pexels-photo-5428010.jpeg?auto=compress&cs=tinysrgb&w=800",
      steps: [
        "Access 'Analytics' from the sidebar",
        "View your overall progress metrics",
        "Analyze subject-wise performance",
        "Track your study time distribution",
        "Monitor your performance trends"
      ],
      tips: [
        "Check analytics weekly to stay on track",
        "Focus on subjects with declining trends",
        "Use insights to optimize your study schedule"
      ]
    },
    {
      title: "Study Session Tracking",
      description: "Track your study sessions with detailed performance scoring and topic coverage",
      image: "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=800",
      steps: [
        "Go to 'Study Timer' in the sidebar",
        "Select your subject before starting",
        "Start the timer when you begin studying",
        "Add topics covered during the session",
        "Rate your performance (1-10) when finished",
        "Stop and save your session"
      ],
      tips: [
        "Be honest with performance ratings",
        "Add specific topics for better tracking",
        "Use consistent timing for accurate analytics"
      ]
    }
  ];

  const advancedSteps = [
    {
      title: "Course-Specific Learning Paths",
      description: "Follow structured learning paths for each subject with milestone tracking",
      image: "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800",
      steps: [
        "Navigate to 'Courses' from the sidebar",
        "Select a subject to view its learning path",
        "Follow the weekly milestones",
        "Complete theory study for each topic",
        "Take topic-specific assessments",
        "Track your progress through the curriculum"
      ],
      tips: [
        "Complete topics in the recommended sequence",
        "Don't skip theory before attempting assessments",
        "Review weak areas before moving to next topics"
      ]
    },
    {
      title: "Settings & Customization",
      description: "Customize your learning experience with advanced settings and preferences",
      image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800",
      steps: [
        "Access 'Settings' from the sidebar",
        "Customize your study preferences",
        "Set notification preferences",
        "Configure AI mentor personality",
        "Adjust accessibility options",
        "Manage your data and privacy settings"
      ],
      tips: [
        "Enable study reminders for consistency",
        "Customize AI responses to match your learning style",
        "Regularly backup your study data"
      ]
    }
  ];

  const stepCategories = {
    'getting-started': gettingStartedSteps,
    'study-planning': studyPlanningSteps,
    'ai-features': aiFeatureSteps,
    'analytics': analyticsSteps,
    'advanced': advancedSteps
  };

  const currentSteps = stepCategories[activeCategory as keyof typeof stepCategories];
  const currentStep = currentSteps[activeStep];

  const nextStep = () => {
    if (activeStep < currentSteps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Use EduAI - Complete Guide",
    "description": "Step-by-step guide to using EduAI's AI-powered exam preparation platform",
    "image": "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "totalTime": "PT30M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": "0"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Computer or Mobile Device"
      },
      {
        "@type": "HowToSupply", 
        "name": "Internet Connection"
      },
      {
        "@type": "HowToSupply",
        "name": "Study Materials (PDFs, Documents)"
      }
    ],
    "step": gettingStartedSteps.map((step, index) => ({
      "@type": "HowToStep",
      "name": step.title,
      "text": step.description,
      "image": step.image,
      "url": `#step-${index + 1}`
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <SEOHead
        title="How to Use EduAI - Complete Step-by-Step Guide | AI-Powered Exam Preparation"
        description="Learn how to use EduAI's AI-powered exam preparation platform with our comprehensive step-by-step guide. Master study planning, AI features, analytics, and advanced tools for competitive exam success."
        keywords="how to use EduAI, exam preparation guide, AI study platform tutorial, study planning guide, competitive exam preparation, online learning tutorial, EdTech platform guide"
        structuredData={structuredData}
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Complete User Guide</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
            How to Use <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EduAI</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Master your exam preparation with our comprehensive step-by-step guide. Learn how to leverage AI-powered features, 
            track your progress, and achieve your academic goals with EduAI's advanced platform.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-800">30 min</div>
              <div className="text-slate-600 text-sm">Setup Time</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-800">5 Steps</div>
              <div className="text-slate-600 text-sm">To Get Started</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-800">500K+</div>
              <div className="text-slate-600 text-sm">Students Using</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <Award className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-800">95%</div>
              <div className="text-slate-600 text-sm">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Choose Your Learning Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setActiveStep(0);

                  // ✅ Smooth scroll to section
      setTimeout(() => {
        sectionRefs[category.id].current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
                }}
                className={`p-4 rounded-xl transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:scale-102'
                }`}
              >
                <category.icon className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium text-sm">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div ref={sectionRefs[activeCategory]} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Steps Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">
                {categories.find(c => c.id === activeCategory)?.name} Steps
              </h3>
              <div className="space-y-3">
                {currentSteps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      activeStep === index
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 text-blue-800'
                        : 'hover:bg-slate-50 text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        activeStep === index
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{step.title}</div>
                        <div className="text-xs text-slate-500 mt-1">{step.description.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              {/* Step Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-xl font-bold">{activeStep + 1}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{currentStep.title}</h2>
                      <p className="text-blue-100">{currentStep.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-200">Step {activeStep + 1} of {currentSteps.length}</div>
                    <div className="w-32 bg-blue-400 rounded-full h-2 mt-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((activeStep + 1) / currentSteps.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-8">
                {/* Screenshot/Image */}
                <div className="mb-8">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200">
                    <img
                      src={currentStep.image}
                      alt={`${currentStep.title} - Step ${activeStep + 1}`}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">Visual Guide</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Steps */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Step-by-Step Instructions</span>
                  </h3>
                  <div className="space-y-4">
                    {currentStep.steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-700 leading-relaxed">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro Tips */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    <span>Pro Tips for Success</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentStep.tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                        <Star className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-700 text-sm leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <button
                    onClick={prevStep}
                    disabled={activeStep === 0}
                    className="flex items-center space-x-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    {currentSteps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveStep(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          activeStep === index ? 'bg-blue-600 scale-125' : 'bg-slate-300 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextStep}
                    disabled={activeStep === currentSteps.length - 1}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference Cards */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Quick Reference Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Daily Study Routine",
                icon: Clock,
                color: "from-blue-500 to-blue-600",
                items: [
                  "Check daily schedule on dashboard",
                  "Start study timer for each session",
                  "Follow AI-recommended time slots",
                  "Take regular breaks as suggested",
                  "Review progress at end of day"
                ]
              },
              {
                title: "Weekly Assessment",
                icon: Target,
                color: "from-green-500 to-green-600",
                items: [
                  "Upload study materials weekly",
                  "Take AI-generated assessments",
                  "Review performance analysis",
                  "Implement improvement suggestions",
                  "Track progress trends"
                ]
              },
              {
                title: "AI Mentor Interaction",
                icon: Brain,
                color: "from-purple-500 to-purple-600",
                items: [
                  "Ask specific study questions",
                  "Upload materials for context",
                  "Get personalized strategies",
                  "Follow expert recommendations",
                  "Track implementation results"
                ]
              },
              {
                title: "Progress Monitoring",
                icon: TrendingUp,
                color: "from-orange-500 to-orange-600",
                items: [
                  "Check analytics dashboard daily",
                  "Monitor subject-wise progress",
                  "Track study time distribution",
                  "Analyze performance trends",
                  "Adjust strategy based on data"
                ]
              },
              {
                title: "Course Navigation",
                icon: BookOpen,
                color: "from-indigo-500 to-indigo-600",
                items: [
                  "Browse available courses",
                  "Follow milestone progression",
                  "Complete theory sections",
                  "Take topic assessments",
                  "Track completion status"
                ]
              },
              {
                title: "Settings & Customization",
                icon: Settings,
                color: "from-slate-500 to-slate-600",
                items: [
                  "Customize study preferences",
                  "Set notification schedules",
                  "Configure AI mentor style",
                  "Manage privacy settings",
                  "Export study data"
                ]
              }
            ].map((card, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className={`bg-gradient-to-r ${card.color} p-6 text-white`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <card.icon className="w-8 h-8" />
                    <h3 className="text-xl font-bold">{card.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {card.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600 text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Tutorial Section */}
        <div id="videos" className="max-p-6 mt-16 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Video Tutorials</h2>
            <p className="text-slate-300 text-lg">
              Watch our comprehensive video guides for visual learners
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Getting Started with EduAI",
                duration: "5:30",
                views: "125K",
                thumbnail: "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=400"
              },
              {
                title: "AI Study Plan Generation",
                duration: "8:45",
                views: "98K",
                thumbnail: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=400"
              },
              {
                title: "Using AI Mentor Effectively",
                duration: "12:20",
                views: "156K",
                thumbnail: "https://images.pexels.com/photos/5428010/pexels-photo-5428010.jpeg?auto=compress&cs=tinysrgb&w=400"
              }
            ].map((video, index) => (
              <div key={index} className="bg-slate-700/50 rounded-2xl overflow-hidden hover:bg-slate-700 transition-all duration-300 cursor-pointer group">
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-white mb-2">{video.title}</h4>
                  <div className="flex items-center space-x-4 text-slate-400 text-sm">
                    <span>{video.views} views</span>
                    <span>•</span>
                    <span>HD Quality</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                question: "How does the AI study plan work?",
                answer: "Our AI analyzes your target exam, current level, available time, and weak areas to create a personalized study schedule. It uses data from 500,000+ successful students to optimize your learning path."
              },
              {
                question: "Is my study data secure and private?",
                answer: "Yes, we use enterprise-grade security with ISO 27001 certification. Your data is encrypted and never shared with third parties. You have full control over your information."
              },
              {
                question: "Can I use EduAI for multiple exams?",
                answer: "Absolutely! You can switch between different exam preparations and maintain separate study plans for each. Our AI adapts to each exam's specific requirements."
              },
              {
                question: "How accurate is the AI performance analysis?",
                answer: "Our AI has 95% accuracy in predicting exam readiness based on study patterns. It's trained on data from successful students and continuously improves with more usage."
              },
              {
                question: "What file formats can I upload?",
                answer: "You can upload PDF, DOC, DOCX, and TXT files up to 10MB each. Our AI extracts content automatically and generates relevant questions and analysis."
              },
              {
                question: "How do I get the most out of the AI mentor?",
                answer: "Be specific in your questions, upload relevant study materials for context, and regularly interact with the mentor. The more data you provide, the better the personalized guidance becomes."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
                <h4 className="font-bold text-slate-800 mb-3 flex items-start space-x-2">
                  <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h4>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Success Journey?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join 500,000+ students who have transformed their exam preparation with EduAI's AI-powered platform. 
              Start your personalized learning journey today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                href="/dashboard"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Rocket className="w-5 h-5" />
                <span>Start Free Trial</span>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Contact Expert</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToUsePage;