import React from 'react';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Star,
  Clock,
  Shield,
  Zap,
  BookOpen,
  MessageSquare,
  Calendar,
  BarChart3,
  Rocket,
  Globe,
  Heart,
  Trophy,
  Lightbulb,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../SEO/SEOHead';
import { useUser } from '@clerk/clerk-react';

const LandingPage: React.FC = () => {
  const { isSignedIn } = useUser();
  
  const features = [
    {
      title: 'AI-Powered Study Mentor',
      description: 'Get personalized guidance from Dr. Rajesh Kumar, our AI mentor with 15+ years of experience mentoring 10,000+ top rankers.',
      icon: Brain,
      color: 'from-blue-500 to-indigo-600',
      benefits: ['24/7 availability', 'Personalized strategies', 'Data-driven insights', 'Expert-level guidance']
    },
    {
      title: 'Intelligent Study Planning',
      description: 'AI creates personalized study schedules based on your exam, timeline, strengths, and learning patterns.',
      icon: Calendar,
      color: 'from-green-500 to-emerald-600',
      benefits: ['Adaptive scheduling', 'Milestone tracking', 'Progress optimization', 'Flexible adjustments']
    },
    {
      title: 'Real-Time Analytics',
      description: 'Comprehensive analytics dashboard with detailed insights into your study patterns and performance trends.',
      icon: BarChart3,
      color: 'from-purple-500 to-pink-600',
      benefits: ['Performance tracking', 'Trend analysis', 'Weakness identification', 'Progress visualization']
    },
    {
      title: 'Smart Content Analysis',
      description: 'Upload study materials and get AI-generated questions, summaries, and personalized assessments.',
      icon: BookOpen,
      color: 'from-orange-500 to-red-600',
      benefits: ['Content extraction', 'Question generation', 'Relevance scoring', 'Topic identification']
    }
  ];

  const examCategories = [
    { name: 'UPSC Civil Services', students: '50,000+', successRate: '92%', icon: '🏛️' },
    { name: 'JEE Main/Advanced', students: '75,000+', successRate: '94%', icon: '⚗️' },
    { name: 'NEET Medical', students: '60,000+', successRate: '93%', icon: '🩺' },
    { name: 'SSC CGL/CHSL', students: '40,000+', successRate: '91%', icon: '📊' },
    { name: 'Banking Exams', students: '35,000+', successRate: '89%', icon: '🏦' },
    { name: 'CAT MBA', students: '25,000+', successRate: '87%', icon: '📈' }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      exam: 'UPSC CSE 2023',
      rank: 'AIR 47',
      image: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'EduAI\'s AI mentor guided me through every step of UPSC preparation. The personalized study plan and real-time analytics helped me identify and improve my weak areas systematically.',
      improvement: '45% score improvement'
    },
    {
      name: 'Arjun Patel',
      exam: 'JEE Advanced 2023',
      rank: 'AIR 156',
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'The AI-generated study schedule was perfectly aligned with my strengths and weaknesses. The performance predictions were incredibly accurate, helping me focus on the right topics.',
      improvement: '38% score improvement'
    },
    {
      name: 'Sneha Reddy',
      exam: 'NEET 2023',
      rank: 'AIR 234',
      image: 'https://images.pexels.com/photos/5428010/pexels-photo-5428010.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'EduAI\'s content analysis feature helped me extract maximum value from my study materials. The AI mentor\'s guidance was like having a personal tutor available 24/7.',
      improvement: '52% score improvement'
    }
  ];

  const stats = [
    { number: '500,000+', label: 'Students Empowered', icon: Users },
    { number: '95%', label: 'Success Rate', icon: Trophy },
    { number: '50+', label: 'Exam Categories', icon: Target },
    { number: '24/7', label: 'AI Support', icon: Brain },
    { number: '15+', label: 'Years Expertise', icon: Award },
    { number: '99.9%', label: 'Platform Uptime', icon: Shield }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "EduAI",
    "description": "AI-powered educational technology platform for competitive exam preparation",
    "url": "https://eduai.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://eduai.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "EduAI",
      "logo": "https://eduai.com/logo.png"
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="EduAI - AI-Powered Exam Preparation Platform | Personalized Study Plans & Analytics"
        description="Transform your competitive exam preparation with EduAI's AI-powered platform. Get personalized study plans, real-time analytics, expert AI mentorship, and achieve 95% success rate in UPSC, JEE, NEET, SSC, Banking exams."
        keywords="AI exam preparation, competitive exam coaching, personalized study plans, UPSC preparation, JEE coaching, NEET study, AI tutor, exam analytics, online learning platform"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4" />
                <span>Trusted by 500,000+ Students Worldwide</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Master Your Exams with 
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"> AI-Powered</span> Precision
              </h1>
              
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                Transform your competitive exam preparation with personalized AI mentorship, intelligent study planning, 
                and real-time analytics. Join the revolution in education technology and achieve your academic dreams.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
                 {isSignedIn ? (
                  <Link
                    to="/app/dashboard" // Redirect to dashboard if signed in
                    className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Rocket className="w-5 h-5" />
                    <span>Go to Dashboard</span>
                  </Link>
                ) : (
                  <>
                <Link
                  to="/get-started#onboarding-progress"
                  className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Rocket className="w-5 h-5" />
                  <span>Get Started</span>
                </Link>
                <Link
                  to="/how-to-use"
                  className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </Link>
                  </>
      )}
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">95%</div>
                  <div className="text-blue-200 text-sm">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">500K+</div>
                  <div className="text-blue-200 text-sm">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">4.9★</div>
                  <div className="text-blue-200 text-sm">User Rating</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="bg-white rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">AI Study Dashboard</h3>
                      <p className="text-slate-600 text-sm">Real-time insights</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-slate-700 text-sm">Today's Progress</span>
                      <span className="font-bold text-green-600">87%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-slate-700 text-sm">Study Streak</span>
                      <span className="font-bold text-blue-600">12 days</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-slate-700 text-sm">Exam Readiness</span>
                      <span className="font-bold text-purple-600">92%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Powerful AI Features for 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Exam Success</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the future of exam preparation with our comprehensive suite of AI-powered tools 
              designed to maximize your learning efficiency and exam performance.
            </p>
            <div className="mt-8">
              <Link
                to="/features"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                <span>Explore All Features</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">{feature.title}</h3>
                  </div>
                </div>
                
                <p className="text-slate-600 leading-relaxed mb-6">{feature.description}</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-slate-700 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Categories */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Comprehensive Coverage for 
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">All Major Exams</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI is specifically trained for different exam patterns and requirements, 
              ensuring you get the most relevant and effective preparation strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {examCategories.map((exam, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="text-center">
                  <div className="text-4xl mb-4">{exam.icon}</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{exam.name}</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 text-sm">Students Helped</span>
                      <span className="font-bold text-blue-600">{exam.students}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 text-sm">Success Rate</span>
                      <span className="font-bold text-green-600">{exam.successRate}</span>
                    </div>
                  </div>
                  <Link
                    to="/get-started"
                    className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 group-hover:scale-105 text-center"
                  >
                    Start Preparation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Success Stories from 
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Top Rankers</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Hear from students who achieved their dream ranks using EduAI's AI-powered preparation strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
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
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Proven Results & Impact</h2>
            <p className="text-slate-300 text-xl max-w-3xl mx-auto">
              Our numbers speak for themselves. See the impact EduAI has made in transforming exam preparation globally.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-slate-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              How EduAI 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Transforms</span> Your Preparation
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI-powered approach combines proven educational methodologies with cutting-edge technology 
              to create the most effective exam preparation experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Profile Analysis',
                description: 'AI analyzes your exam goals, current level, and learning preferences to create your unique student profile.',
                icon: Target,
                color: 'from-blue-500 to-blue-600'
              },
              {
                step: '02',
                title: 'Intelligent Planning',
                description: 'Generate personalized study schedules with optimal time allocation and milestone tracking.',
                icon: Calendar,
                color: 'from-green-500 to-green-600'
              },
              {
                step: '03',
                title: 'AI-Powered Learning',
                description: 'Study with AI mentor guidance, smart content analysis, and adaptive question generation.',
                icon: Brain,
                color: 'from-purple-500 to-purple-600'
              },
              {
                step: '04',
                title: 'Continuous Optimization',
                description: 'Real-time analytics and performance tracking ensure continuous improvement and exam readiness.',
                icon: TrendingUp,
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
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Exam Preparation?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join 500,000+ students who have revolutionized their study approach with EduAI. 
            Start your personalized AI-powered learning journey today and achieve your academic dreams.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            {isSignedIn ? (
              <Link
                to="/app/dashboard" // Redirect to dashboard if signed in
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Rocket className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <>
            <Link
              to="/get-started"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Rocket className="w-5 h-5" />
              <span>Get Started Free</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Talk to Expert</span>
            </Link>
              </>
      )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-300" />
              <span className="text-blue-100">14-day free trial</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-300" />
              <span className="text-blue-100">No credit card required</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-300" />
              <span className="text-blue-100">Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;