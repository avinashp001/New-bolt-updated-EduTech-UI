import React, { useState } from 'react';
import { 
  Brain, 
  Target, 
  BarChart3, 
  Clock, 
  BookOpen, 
  Upload, 
  Calendar,
  Rocket,
  Award,
  MessageSquare,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Star,
  CheckCircle,
  Play,
  ArrowRight,
  Sparkles,
  Eye,
  Download,
  Settings,
  Globe,
  Heart,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../SEO/SEOHead';

const FeaturesPage: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState('ai-mentor');

  const mainFeatures = [
    {
      id: 'ai-mentor',
      title: 'AI-Powered Study Mentor',
      description: 'Get personalized guidance from Dr. Rajesh Kumar, our AI mentor with 15+ years of experience.',
      icon: Brain,
      color: 'from-blue-500 to-indigo-600',
      benefits: [
        '24/7 availability for instant guidance',
        'Personalized study strategies',
        'Performance analysis and recommendations',
        'Exam-specific preparation tips'
      ],
      demo: {
        title: 'AI Mentor in Action',
        description: 'See how our AI mentor provides personalized guidance based on your study patterns and performance.',
        image: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    },
    {
      id: 'study-planning',
      title: 'Intelligent Study Planning',
      description: 'AI creates personalized study schedules based on your exam, timeline, and learning patterns.',
      icon: Calendar,
      color: 'from-green-500 to-emerald-600',
      benefits: [
        'Adaptive daily schedules',
        'Milestone tracking and goals',
        'Automatic progress optimization',
        'Flexible plan adjustments'
      ],
      demo: {
        title: 'Smart Schedule Generation',
        description: 'Watch how AI creates a comprehensive study plan tailored to your specific needs and timeline.',
        image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    },
    {
      id: 'analytics',
      title: 'Real-Time Analytics',
      description: 'Comprehensive analytics dashboard with detailed insights into your study patterns.',
      icon: BarChart3,
      color: 'from-purple-500 to-pink-600',
      benefits: [
        'Performance trend analysis',
        'Weakness identification',
        'Study time optimization',
        'Progress visualization'
      ],
      demo: {
        title: 'Advanced Analytics Dashboard',
        description: 'Explore detailed analytics that help you understand your learning patterns and optimize performance.',
        image: 'https://images.pexels.com/photos/5428010/pexels-photo-5428010.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    },
    {
      id: 'content-analysis',
      title: 'Smart Content Analysis',
      description: 'Upload study materials and get AI-generated questions, summaries, and assessments.',
      icon: Upload,
      color: 'from-orange-500 to-red-600',
      benefits: [
        'Automatic content extraction',
        'AI-generated questions',
        'Relevance scoring',
        'Topic identification'
      ],
      demo: {
        title: 'Content Analysis Engine',
        description: 'See how AI analyzes your study materials and creates personalized assessments.',
        image: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    }
  ];

  const additionalFeatures = [
    {
      title: 'Study Session Timer',
      description: 'Track your study time with intelligent session management',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your improvement with detailed progress reports',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Secure Platform',
      description: 'ISO 27001 certified security for your data protection',
      icon: Shield,
      color: 'text-purple-600'
    },
    {
      title: 'Mobile Optimized',
      description: 'Study anywhere with our responsive mobile interface',
      icon: Globe,
      color: 'text-orange-600'
    },
    {
      title: 'Community Support',
      description: 'Connect with fellow students and expert mentors',
      icon: Users,
      color: 'text-pink-600'
    },
    {
      title: 'Offline Access',
      description: 'Download materials and study even without internet',
      icon: Download,
      color: 'text-indigo-600'
    }
  ];

  const currentFeature = mainFeatures.find(f => f.id === activeFeature) || mainFeatures[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <SEOHead
        title="Features - AI-Powered Exam Preparation Platform | EduAI"
        description="Discover EduAI's comprehensive features including AI mentorship, intelligent study planning, real-time analytics, and smart content analysis for competitive exam success."
        keywords="EduAI features, AI study mentor, intelligent study planning, exam preparation analytics, content analysis, personalized learning"
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Platform Features</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 mb-6">
            Powerful Features for 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Exam Success</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover how EduAI's advanced AI technology and proven methodologies work together 
            to create the most effective exam preparation experience.
          </p>
        </div>

        {/* Feature Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {mainFeatures.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`p-4 rounded-xl transition-all duration-300 text-left ${
                  activeFeature === feature.id
                    ? `bg-gradient-to-r ${feature.color} text-white shadow-lg scale-105`
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:scale-102'
                }`}
              >
                <feature.icon className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm opacity-90">{feature.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Detail */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Content */}
            <div className="p-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${currentFeature.color} rounded-2xl flex items-center justify-center`}>
                  <currentFeature.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">{currentFeature.title}</h2>
              </div>
              
              <p className="text-lg text-slate-600 leading-relaxed mb-8">{currentFeature.description}</p>
              
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-bold text-slate-800">Key Benefits:</h3>
                {currentFeature.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/get-started"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Rocket className="w-5 h-5" />
                  <span>Try This Feature</span>
                </Link>
                <Link
                  to="/how-to-use"
                  className="inline-flex items-center space-x-2 border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all duration-300"
                >
                  <Eye className="w-5 h-5" />
                  <span>Learn More</span>
                </Link>
              </div>
            </div>

            {/* Demo Visual */}
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-12 flex items-center justify-center">
              <div className="text-center">
                <img 
                  src={currentFeature.demo.image} 
                  alt={currentFeature.demo.title}
                  className="w-full max-w-md rounded-2xl shadow-xl border border-slate-300 mb-6"
                />
                <h3 className="text-xl font-bold text-slate-800 mb-3">{currentFeature.demo.title}</h3>
                <p className="text-slate-600 leading-relaxed">{currentFeature.demo.description}</p>
                <button className="mt-6 inline-flex items-center space-x-2 bg-white text-slate-800 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all duration-300 shadow-lg">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">More Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                  feature.color === 'text-blue-600' ? 'bg-blue-100' :
                  feature.color === 'text-green-600' ? 'bg-green-100' :
                  feature.color === 'text-purple-600' ? 'bg-purple-100' :
                  feature.color === 'text-orange-600' ? 'bg-orange-100' :
                  feature.color === 'text-pink-600' ? 'bg-pink-100' :
                  'bg-indigo-100'
                }`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">EduAI vs Traditional Methods</h2>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-800">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-green-800">EduAI Platform</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-600">Traditional Methods</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    {
                      feature: 'Personalized Study Plans',
                      eduai: 'AI-generated based on your profile',
                      traditional: 'Generic one-size-fits-all'
                    },
                    {
                      feature: 'Progress Tracking',
                      eduai: 'Real-time analytics and insights',
                      traditional: 'Manual tracking or basic reports'
                    },
                    {
                      feature: 'Mentor Availability',
                      eduai: '24/7 AI mentor support',
                      traditional: 'Limited scheduled sessions'
                    },
                    {
                      feature: 'Content Analysis',
                      eduai: 'Automatic PDF analysis and questions',
                      traditional: 'Manual question creation'
                    },
                    {
                      feature: 'Adaptation',
                      eduai: 'Continuous plan optimization',
                      traditional: 'Static plans with minimal changes'
                    },
                    {
                      feature: 'Cost',
                      eduai: 'Affordable monthly subscription',
                      traditional: 'Expensive coaching fees'
                    }
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-800">{row.feature}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-green-700 font-medium">{row.eduai}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-600">{row.traditional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Integration Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Seamless Integration</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
              <Brain className="w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold mb-4">AI-First Approach</h3>
              <p className="text-blue-100 leading-relaxed mb-6">
                Every feature is powered by advanced AI that learns from your behavior and adapts to your needs.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-200" />
                  <span className="text-blue-100">Machine learning algorithms</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-200" />
                  <span className="text-blue-100">Natural language processing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-200" />
                  <span className="text-blue-100">Predictive analytics</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 text-white">
              <Target className="w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Exam-Specific</h3>
              <p className="text-green-100 leading-relaxed mb-6">
                Tailored specifically for each competitive exam with pattern-specific strategies and content.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-200" />
                  <span className="text-green-100">Exam pattern analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-200" />
                  <span className="text-green-100">Syllabus-based planning</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-200" />
                  <span className="text-green-100">Previous year analysis</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-8 text-white">
              <Heart className="w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Student-Centric</h3>
              <p className="text-purple-100 leading-relaxed mb-6">
                Designed with student success at the center, focusing on learning effectiveness and well-being.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-purple-200" />
                  <span className="text-purple-100">Stress management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-purple-200" />
                  <span className="text-purple-100">Motivation tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-purple-200" />
                  <span className="text-purple-100">Wellness monitoring</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Built with Cutting-Edge Technology</h2>
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Artificial Intelligence',
                  description: 'Advanced ML models for personalization',
                  icon: Brain,
                  tech: 'Mistral AI, TensorFlow'
                },
                {
                  title: 'Real-time Database',
                  description: 'Instant sync across all devices',
                  icon: Zap,
                  tech: 'Supabase, PostgreSQL'
                },
                {
                  title: 'Secure Authentication',
                  description: 'Enterprise-grade security',
                  icon: Shield,
                  tech: 'Clerk, OAuth 2.0'
                },
                {
                  title: 'Modern Frontend',
                  description: 'Fast, responsive interface',
                  icon: Globe,
                  tech: 'React, TypeScript'
                }
              ].map((tech, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <tech.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{tech.title}</h3>
                  <p className="text-slate-300 text-sm mb-3">{tech.description}</p>
                  <div className="text-xs text-slate-400">{tech.tech}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Experience the Future of Exam Preparation</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Don't just prepare for exams – master them with AI-powered precision and expert guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <Link
                to="/get-started"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Rocket className="w-5 h-5" />
                <span>Start Free Trial</span>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Talk to Expert</span>
              </Link>
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
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;