import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, 
  Brain, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  Play,
  Trophy,
  Star,
  Clock,
  Award,
  Users,
  Zap,
  BookOpen,
  TrendingUp,
  Shield,
  Globe,
  Heart,
  Sparkles,
  ChevronRight,
  User,
  Mail,
  Calendar,
  GraduationCap
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SEOHead from '../SEO/SEOHead';
import { useUser } from '@clerk/clerk-react';

const GetStartedPage: React.FC = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedExam, setSelectedExam] = useState('');
  const [currentStep, setCurrentStep] = useState(1);


  const step2Ref = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");

      // Wait for DOM to render before trying to scroll
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) {
          const yOffset = -80; // adjust if you have a sticky navbar
          const y =
            section.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;

          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 50); // small delay to ensure section is mounted
    }
  }, [location]);

  

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      // This page is for new users. If already signed in, redirect to dashboard.
      // The AuthLayout will handle further redirection to onboarding if needed.
      navigate('/app/dashboard', { replace: true });
    }
  }, [isSignedIn, navigate, location.hash]);
  

  const examTypes = [
    { id: 'upsc', name: 'UPSC Civil Services', icon: '🏛️', students: '50,000+', difficulty: 'High' },
    { id: 'jee', name: 'JEE Main/Advanced', icon: '⚗️', students: '75,000+', difficulty: 'High' },
    { id: 'neet', name: 'NEET Medical', icon: '🩺', students: '60,000+', difficulty: 'High' },
    { id: 'ssc', name: 'SSC CGL/CHSL', icon: '📊', students: '40,000+', difficulty: 'Medium' },
    { id: 'banking', name: 'Banking Exams', icon: '🏦', students: '35,000+', difficulty: 'Medium' },
    { id: 'cat', name: 'CAT MBA', icon: '📈', students: '25,000+', difficulty: 'High' }
  ];

  const steps = [
    {
      number: 1,
      title: 'Choose Your Exam',
      description: 'Select your target competitive exam',
      icon: Target,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      number: 2,
      title: 'Create Account',
      description: 'Sign up with your email',
      icon: User,
      color: 'from-green-500 to-emerald-600'
    },
    {
      number: 3,
      title: 'AI Analysis',
      description: 'AI creates your personalized plan',
      icon: Brain,
      color: 'from-purple-500 to-violet-600'
    },
    {
      number: 4,
      title: 'Start Learning',
      description: 'Begin your success journey',
      icon: Rocket,
      color: 'from-orange-500 to-red-600'
    }
  ];

  const benefits = [
    {
      title: '95% Success Rate',
      description: 'Join 500,000+ successful students',
      icon: Trophy,
      stat: '500K+',
      color: 'text-yellow-600'
    },
    {
      title: '24/7 AI Mentor',
      description: 'Get expert guidance anytime',
      icon: Brain,
      stat: '24/7',
      color: 'text-blue-600'
    },
    {
      title: 'Personalized Plans',
      description: 'AI-crafted study schedules',
      icon: Target,
      stat: '100%',
      color: 'text-green-600'
    },
    {
      title: 'Real-time Analytics',
      description: 'Track every aspect of progress',
      icon: TrendingUp,
      stat: 'Live',
      color: 'text-purple-600'
    }
  ];

  const handleExamSelect = (examId: string) => {
    setSelectedExam(examId);
    setCurrentStep(2);
  };

  const handleGetStarted = () => {
    if (selectedExam) {
      // Store selected exam in localStorage for later use
      const selectedExamName = examTypes.find(e => e.id === selectedExam)?.name || selectedExam;
      localStorage.setItem('selectedExam', selectedExamName);
      
      // Check if user is already signed in
      if (isSignedIn) {
        navigate('/app/onboarding');
      } else {
        navigate('/login');
      }
    } else {
      setCurrentStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <SEOHead
        title="Get Started with EduAI - Begin Your AI-Powered Exam Preparation Journey"
        description="Start your competitive exam preparation with EduAI's AI-powered platform. Choose your exam, create your account, and get personalized study plans in minutes."
        keywords="get started EduAI, begin exam preparation, AI study platform signup, competitive exam preparation, personalized learning"
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Rocket className="w-4 h-4" />
            <span>Start Your Success Journey</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 mb-6">
            Get Started with 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> EduAI</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Join 500,000+ students who transformed their exam preparation with AI. 
            Get personalized study plans, expert mentorship, and achieve your academic dreams.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center space-x-8 mb-12">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-slate-600">4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-slate-600">500K+ Students</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-green-500" />
              <span className="text-slate-600">95% Success Rate</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-500" />
              <span className="text-slate-600">ISO Certified</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div id="onboarding-progress" className="mb-16">
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className={`flex items-center space-x-3 ${
                    currentStep >= step.number ? 'opacity-100' : 'opacity-50'
                  }`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold ${
                      currentStep >= step.number 
                        ? `bg-gradient-to-r ${step.color}` 
                        : 'bg-slate-300'
                    }`}>
                      {currentStep > step.number ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="hidden lg:block">
                      <div className="font-semibold text-slate-800">{step.title}</div>
                      <div className="text-sm text-slate-600">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-6 h-6 text-slate-300" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Based on Current Step */}
        {currentStep === 1 && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Choose Your Target Exam</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Select your competitive exam to get AI-powered preparation strategies tailored specifically for your goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {examTypes.map((exam) => (
                <div
                  key={exam.id}
                  onClick={() => handleExamSelect(exam.id)}
                  className={`bg-white rounded-2xl shadow-lg border-2 p-8 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                    selectedExam === exam.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{exam.icon}</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{exam.name}</h3>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 text-sm">Students Helped</span>
                        <span className="font-bold text-blue-600">{exam.students}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 text-sm">Difficulty</span>
                        <span className={`font-bold ${
                          exam.difficulty === 'High' ? 'text-red-600' : 'text-orange-600'
                        }`}>{exam.difficulty}</span>
                      </div>
                    </div>
                    <div className={`w-full py-3 rounded-xl font-medium transition-all ${
                      selectedExam === exam.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}>
                      {selectedExam === exam.id ? 'Selected' : 'Select Exam'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedExam && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
                >
                  <span>Continue to Sign Up</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep >= 2 && (
          <div className="mb-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Preparation?</h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                {selectedExam ? (
                  <>You've selected <strong>{examTypes.find(e => e.id === selectedExam)?.name}</strong>. 
                  Create your account to get started with AI-powered preparation.</>
                ) : (
                  'Create your account and let AI create a personalized study plan for your success.'
                )}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Rocket className="w-5 h-5" />
                  <span>Create Free Account</span>
                </button>
                <Link
                  to="/features"
                  className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Explore Features</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Why Choose EduAI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                  benefit.color === 'text-yellow-600' ? 'bg-yellow-100' :
                  benefit.color === 'text-blue-600' ? 'bg-blue-100' :
                  benefit.color === 'text-green-600' ? 'bg-green-100' :
                  'bg-purple-100'
                }`}>
                  <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-2">{benefit.stat}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">How EduAI Works</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Sign Up & Profile',
                description: 'Create your account and tell us about your exam goals and current preparation level.',
                icon: User,
                color: 'from-blue-500 to-blue-600'
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI analyzes your profile and creates a personalized study strategy.',
                icon: Brain,
                color: 'from-green-500 to-green-600'
              },
              {
                step: '03',
                title: 'Study & Track',
                description: 'Follow your AI-generated plan and track progress with real-time analytics.',
                icon: BookOpen,
                color: 'from-purple-500 to-purple-600'
              },
              {
                step: '04',
                title: 'Achieve Success',
                description: 'Continuous optimization and expert guidance lead you to exam success.',
                icon: Award,
                color: 'from-orange-500 to-red-600'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-slate-300 mb-2">{step.step}</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
                
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                exam: 'UPSC CSE 2023',
                rank: 'AIR 47',
                image: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=150',
                quote: 'EduAI\'s personalized approach helped me identify and strengthen my weak areas systematically.',
                improvement: '45% improvement'
              },
              {
                name: 'Arjun Patel',
                exam: 'JEE Advanced 2023',
                rank: 'AIR 156',
                image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=150',
                quote: 'The AI mentor was like having a personal tutor available 24/7. Incredible support!',
                improvement: '38% improvement'
              },
              {
                name: 'Sneha Reddy',
                exam: 'NEET 2023',
                rank: 'AIR 234',
                image: 'https://images.pexels.com/photos/5428010/pexels-photo-5428010.jpeg?auto=compress&cs=tinysrgb&w=150',
                quote: 'The real-time analytics helped me optimize my study schedule for maximum efficiency.',
                improvement: '52% improvement'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-blue-200"
                  />
                  <div>
                    <h3 className="font-bold text-slate-800">{testimonial.name}</h3>
                    <p className="text-blue-600 font-medium">{testimonial.exam}</p>
                    <p className="text-green-600 font-bold text-sm">{testimonial.rank}</p>
                  </div>
                </div>
                
                <blockquote className="text-slate-700 leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                    {testimonial.improvement}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Success Journey?</h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Join the revolution in exam preparation. Get personalized AI guidance and achieve your academic dreams.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Rocket className="w-5 h-5" />
                <span>Start Free Trial</span>
              </button>
              <Link
                to="/how-to-use"
                className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-slate-800 transition-all duration-300 transform hover:scale-105"
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-300" />
                <span className="text-slate-300">14-day free trial</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-300" />
                <span className="text-slate-300">No credit card required</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-300" />
                <span className="text-slate-300">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStartedPage;