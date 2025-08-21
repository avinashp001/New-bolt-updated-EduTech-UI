import React from 'react';
import { 
  Brain, 
  Target, 
  Users, 
  Award, 
  TrendingUp, 
  Shield, 
  Heart, 
  Zap,
  MessageSquare,
  BookOpen,
  Star,
  CheckCircle,
  Globe,
  Lightbulb,
  Rocket,
  Clock,
  Trophy,
  Sparkles
} from 'lucide-react';
import SEOHead from '../SEO/SEOHead';

const AboutPage: React.FC = () => {
  const milestones = [
    { year: '2019', title: 'EduAI Founded', description: 'Started with a vision to democratize quality education through AI' },
    { year: '2020', title: 'First AI Mentor', description: 'Launched Dr. Rajesh Kumar, our first AI-powered study mentor' },
    { year: '2021', title: '100K Students', description: 'Reached 100,000 students across India and globally' },
    { year: '2022', title: 'Advanced Analytics', description: 'Introduced real-time study analytics and performance tracking' },
    { year: '2023', title: 'Global Expansion', description: 'Expanded to serve students in 50+ countries worldwide' },
    { year: '2024', title: '500K+ Success Stories', description: 'Celebrating 500,000+ students achieving their exam goals' }
  ];

  const teamMembers = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Chief AI Mentor & Educational Expert',
      experience: '15+ years',
      achievement: '10,000+ students mentored to top ranks',
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=300',
      expertise: ['UPSC Preparation', 'AI-Powered Learning', 'Performance Psychology', 'Study Strategy Design']
    },
    {
      name: 'Prof. Anita Sharma',
      role: 'Head of Curriculum & Assessment',
      experience: '20+ years',
      achievement: 'Former UPSC examiner, curriculum expert',
      image: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=300',
      expertise: ['Curriculum Design', 'Assessment Strategy', 'Educational Psychology', 'Exam Pattern Analysis']
    },
    {
      name: 'Dr. Vikram Singh',
      role: 'AI Research Director',
      experience: '12+ years',
      achievement: 'PhD in Machine Learning, 50+ research papers',
      image: 'https://images.pexels.com/photos/5428010/pexels-photo-5428010.jpeg?auto=compress&cs=tinysrgb&w=300',
      expertise: ['Machine Learning', 'Natural Language Processing', 'Educational AI', 'Data Science']
    }
  ];

  const values = [
    {
      title: 'Excellence in Education',
      description: 'We are committed to providing world-class educational experiences that empower students to achieve their highest potential.',
      icon: Award,
      color: 'text-yellow-600'
    },
    {
      title: 'Innovation Through AI',
      description: 'We leverage cutting-edge artificial intelligence to personalize learning and make quality education accessible to everyone.',
      icon: Brain,
      color: 'text-blue-600'
    },
    {
      title: 'Student-Centric Approach',
      description: 'Every feature, every algorithm, and every decision is made with our students\' success and well-being at the center.',
      icon: Heart,
      color: 'text-red-600'
    },
    {
      title: 'Data-Driven Results',
      description: 'We use comprehensive analytics and evidence-based methods to ensure measurable improvement in student performance.',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Ethical AI Practices',
      description: 'We maintain the highest standards of AI ethics, ensuring fairness, transparency, and responsible use of technology.',
      icon: Shield,
      color: 'text-purple-600'
    },
    {
      title: 'Global Accessibility',
      description: 'We believe quality education should be accessible to students worldwide, regardless of their geographical or economic background.',
      icon: Globe,
      color: 'text-indigo-600'
    }
  ];

  const achievements = [
    { number: '500,000+', label: 'Students Empowered', icon: Users },
    { number: '95%', label: 'Success Rate', icon: Trophy },
    { number: '50+', label: 'Exam Categories', icon: Target },
    { number: '15+', label: 'Years of Expertise', icon: Clock },
    { number: '24/7', label: 'AI Support', icon: Brain },
    { number: '99.9%', label: 'Platform Uptime', icon: Shield }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EduAI",
    "description": "AI-powered educational technology platform for competitive exam preparation",
    "url": "https://eduai.com",
    "logo": "https://eduai.com/logo.png",
    "foundingDate": "2019",
    "founders": [
      {
        "@type": "Person",
        "name": "Dr. Rajesh Kumar",
        "jobTitle": "Chief AI Mentor & Educational Expert"
      }
    ],
    "numberOfEmployees": "50-100",
    "industry": "Educational Technology",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Education Street",
      "addressLocality": "New Delhi",
      "addressRegion": "Delhi",
      "postalCode": "110001",
      "addressCountry": "IN"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <SEOHead
        title="About EduAI - Leading AI-Powered EdTech Platform | Our Story & Mission"
        description="Learn about EduAI's mission to revolutionize exam preparation through AI. Meet our expert team, discover our values, and see how we've helped 500,000+ students achieve success in competitive exams."
        keywords="about EduAI, AI education platform, EdTech company, exam preparation experts, educational technology, AI-powered learning, competitive exam coaching"
        structuredData={structuredData}
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>About EduAI</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 mb-8">
            Revolutionizing Education with 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Artificial Intelligence</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-12">
            EduAI is India's leading AI-powered educational technology platform, transforming how students prepare for competitive exams. 
            With 15+ years of educational expertise and cutting-edge AI technology, we've helped over 500,000 students achieve their academic dreams.
          </p>
          
          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <achievement.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-800 mb-1">{achievement.number}</div>
                <div className="text-slate-600 text-sm">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-blue-100 leading-relaxed text-lg mb-6">
              To democratize quality education by making personalized, AI-powered learning accessible to every student, 
              regardless of their background or location. We believe that with the right guidance and technology, 
              every student can achieve excellence in their chosen field.
            </p>
            <ul className="space-y-3">
              {[
                'Personalized learning experiences for every student',
                'AI-powered insights for optimal study strategies',
                'Comprehensive support throughout the learning journey',
                'Measurable results and continuous improvement'
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-blue-100">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 text-white">
            <div className="flex items-center space-x-3 mb-6">
              <Lightbulb className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Our Vision</h2>
            </div>
            <p className="text-green-100 leading-relaxed text-lg mb-6">
              To become the world's most trusted AI-powered educational platform, where every student receives 
              personalized mentorship equivalent to having a top-tier educator by their side 24/7. We envision 
              a future where AI enhances human potential in education.
            </p>
            <ul className="space-y-3">
              {[
                'Global leader in AI-powered education',
                'Personalized learning for 10 million+ students',
                'Revolutionary AI that understands each learner',
                'Bridge the gap between potential and achievement'
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span className="text-green-100">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Our Story Timeline */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-slate-800 mb-3">{milestone.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    value.color === 'text-yellow-600' ? 'bg-yellow-100' :
                    value.color === 'text-blue-600' ? 'bg-blue-100' :
                    value.color === 'text-red-600' ? 'bg-red-100' :
                    value.color === 'text-green-600' ? 'bg-green-100' :
                    value.color === 'text-purple-600' ? 'bg-purple-100' :
                    'bg-indigo-100'
                  }`}>
                    <value.icon className={`w-6 h-6 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{value.title}</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Expert Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Meet Our Expert Team</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-4">
                <div className="relative">
                  <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-lg font-bold">{member.name}</div>
                    <div className="text-sm text-blue-200">{member.experience} Experience</div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{member.role}</h3>
                  <p className="text-blue-600 font-medium mb-4">{member.achievement}</p>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-700">Expertise Areas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, skillIndex) => (
                        <span key={skillIndex} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology & Innovation */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 text-white mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Technology & Innovation</h2>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto">
              Our cutting-edge AI technology is built on years of research and real-world application in educational settings
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Machine Learning',
                description: 'Advanced ML algorithms that adapt to individual learning patterns',
                icon: Brain,
                stats: '50+ ML models'
              },
              {
                title: 'Natural Language Processing',
                description: 'Sophisticated NLP for content analysis and question generation',
                icon: MessageSquare,
                stats: '99% accuracy'
              },
              {
                title: 'Predictive Analytics',
                description: 'AI-powered predictions for exam readiness and performance',
                icon: TrendingUp,
                stats: '95% prediction accuracy'
              },
              {
                title: 'Personalization Engine',
                description: 'Dynamic content and strategy personalization for each student',
                icon: Target,
                stats: '1M+ data points'
              }
            ].map((tech, index) => (
              <div key={index} className="bg-slate-700/50 rounded-2xl p-6 border border-slate-600 hover:border-blue-500/50 transition-all duration-300">
                <tech.icon className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-lg font-bold mb-3">{tech.title}</h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">{tech.description}</p>
                <div className="text-blue-400 font-medium text-sm">{tech.stats}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Awards & Recognition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'EdTech Excellence Award 2024',
                organization: 'India Education Summit',
                icon: Award,
                color: 'from-yellow-500 to-orange-500'
              },
              {
                title: 'Best AI Innovation in Education',
                organization: 'Global EdTech Awards',
                icon: Brain,
                color: 'from-blue-500 to-indigo-500'
              },
              {
                title: 'Student Choice Award',
                organization: 'Education Technology Review',
                icon: Users,
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'ISO 27001 Certification',
                organization: 'Information Security',
                icon: Shield,
                color: 'from-purple-500 to-pink-500'
              }
            ].map((award, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-16 h-16 bg-gradient-to-r ${award.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <award.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{award.title}</h3>
                <p className="text-slate-600 text-sm">{award.organization}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Join the EduAI Revolution</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Be part of the next generation of successful students who leverage AI for academic excellence. 
              Start your personalized learning journey today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                href="/app/dashboard"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Rocket className="w-5 h-5" />
                <span>Start Your Journey</span>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Contact Our Experts</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;