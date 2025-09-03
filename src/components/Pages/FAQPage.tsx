import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Brain, 
  Target, 
  Shield, 
  Users,
  Zap,
  Phone,
  Mail,
  BookOpen,
  Clock,
  Award,
  MessageSquare,
  Star,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import SEOHead from '../SEO/SEOHead';

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const categories = [
    { id: 'general', name: 'General', icon: HelpCircle, count: 8 },
    { id: 'ai-features', name: 'AI Features', icon: Brain, count: 12 },
    { id: 'study-planning', name: 'Study Planning', icon: Target, count: 10 },
    { id: 'technical', name: 'Technical', icon: Zap, count: 9 },
    { id: 'billing', name: 'Billing & Account', icon: Shield, count: 7 },
    { id: 'exams', name: 'Exam Specific', icon: BookOpen, count: 15 }
  ];

  const faqs = {
    general: [
      {
        id: 'what-is-eduai',
        question: 'What is EduAI and how does it work?',
        answer: 'EduAI is an AI-powered educational technology platform designed specifically for competitive exam preparation. Our platform combines 15+ years of educational expertise with advanced artificial intelligence to provide personalized study plans, real-time analytics, AI mentorship, and comprehensive progress tracking. The AI analyzes your learning patterns, strengths, and weaknesses to create customized study strategies that adapt to your progress.',
        tags: ['platform', 'AI', 'overview']
      },
      {
        id: 'who-can-use',
        question: 'Who can use EduAI? Is it suitable for all exam types?',
        answer: 'EduAI is designed for students preparing for competitive exams including UPSC Civil Services, JEE Main/Advanced, NEET, SSC CGL/CHSL, Banking exams (SBI, IBPS), CAT, GATE, and Board exams. Our AI adapts to different exam patterns and requirements. Whether you\'re a beginner or advanced student, our platform customizes the experience based on your current level and target goals.',
        tags: ['exams', 'students', 'eligibility']
      },
      {
        id: 'success-rate',
        question: 'What is EduAI\'s success rate and how is it measured?',
        answer: 'EduAI maintains a 95% success rate, measured by students achieving their target scores or clearing their competitive exams within their planned timeline. This rate is calculated from students who actively use the platform for at least 3 months and follow the AI-generated study plans. Our success metrics include exam clearance rates, score improvements, and goal achievement within set timelines.',
        tags: ['success', 'results', 'statistics']
      },
      {
        id: 'free-trial',
        question: 'Is there a free trial available? What features are included?',
        answer: 'Yes! EduAI offers a comprehensive 14-day free trial that includes access to AI study plan generation, basic analytics, study timer, and limited AI mentor interactions. During the trial, you can upload up to 5 study materials, generate one complete study plan, and access all core features. No credit card required for the trial period.',
        tags: ['trial', 'free', 'features']
      },
      {
        id: 'data-security',
        question: 'How secure is my personal and study data on EduAI?',
        answer: 'Data security is our top priority. EduAI is ISO 27001 certified and uses enterprise-grade encryption for all data transmission and storage. Your study materials, progress data, and personal information are encrypted and stored securely. We never share your data with third parties, and you have full control over your information with options to export or delete your data anytime.',
        tags: ['security', 'privacy', 'data']
      },
      {
        id: 'mobile-app',
        question: 'Is there a mobile app available for EduAI?',
        answer: 'Currently, EduAI is available as a responsive web application that works seamlessly on all devices including smartphones, tablets, and desktops. Our mobile-optimized interface provides full functionality on mobile browsers. Native iOS and Android apps are in development and will be launched in Q2 2024 with additional offline features.',
        tags: ['mobile', 'app', 'devices']
      },
      {
        id: 'offline-access',
        question: 'Can I access EduAI features offline?',
        answer: 'Some features are available offline including downloaded study materials, saved study plans, and basic timer functionality. However, AI features like mentor chat, real-time analytics, and content generation require an internet connection. We\'re working on enhanced offline capabilities for the upcoming mobile apps.',
        tags: ['offline', 'internet', 'access']
      },
      {
        id: 'customer-support',
        question: 'What kind of customer support does EduAI provide?',
        answer: 'EduAI provides multi-tier support: 24/7 AI-powered instant support, email support with <24 hour response time, phone support during business hours (9 AM - 9 PM IST), and live chat with human experts. Premium users get priority support and can schedule one-on-one consultation calls with our education experts.',
        tags: ['support', 'help', 'assistance']
      }
    ],
    'ai-features': [
      {
        id: 'ai-mentor-accuracy',
        question: 'How accurate is the AI mentor Dr. Rajesh Kumar?',
        answer: 'Dr. Rajesh Kumar, our AI mentor, is trained on data from 500,000+ successful students and 15+ years of educational expertise. The AI has 95% accuracy in providing relevant study guidance and 92% accuracy in predicting exam readiness. The mentor continuously learns from user interactions and feedback to improve its recommendations.',
        tags: ['AI', 'mentor', 'accuracy']
      },
      {
        id: 'study-plan-generation',
        question: 'How does AI generate personalized study plans?',
        answer: 'Our AI analyzes multiple factors including your target exam, current preparation level, available study time, weak subjects, learning patterns, and historical data from successful students. It creates a day-by-day schedule with specific topics, time allocations, revision cycles, and milestone tracking. The plan adapts based on your progress and performance.',
        tags: ['study plan', 'personalization', 'AI']
      },
      {
        id: 'content-analysis',
        question: 'How does AI analyze uploaded study materials?',
        answer: 'When you upload PDFs or documents, our AI uses advanced Natural Language Processing to extract key concepts, identify important topics, generate relevant questions, and assess content relevance to your target exam. The AI can process content in multiple languages and formats, providing topic summaries, formula extraction, and study recommendations.',
        tags: ['content', 'analysis', 'upload']
      },
      {
        id: 'performance-prediction',
        question: 'Can AI predict my exam performance accurately?',
        answer: 'Our AI performance prediction model has 95% accuracy in predicting exam readiness based on study patterns, assessment scores, and progress trends. The AI considers factors like consistency, topic mastery, weak area improvement, and time management to provide realistic performance estimates and readiness scores.',
        tags: ['prediction', 'performance', 'accuracy']
      },
      {
        id: 'ai-question-generation',
        question: 'How does AI generate questions from my study materials?',
        answer: 'Our AI reads and comprehends your uploaded content, identifies key concepts, and generates multiple-choice questions that test understanding, application, and analysis. The questions are tailored to your exam pattern and difficulty level. The AI ensures questions cover all important topics from your material and provides detailed explanations.',
        tags: ['questions', 'generation', 'materials']
      },
      {
        id: 'ai-limitations',
        question: 'What are the limitations of the AI features?',
        answer: 'While our AI is highly advanced, it has some limitations: it requires quality input data for best results, may occasionally misinterpret very poor quality or handwritten content, and works best with structured study materials. The AI is continuously improving, and we regularly update its capabilities based on user feedback and new research.',
        tags: ['limitations', 'AI', 'accuracy']
      }
    ],
    'study-planning': [
      {
        id: 'plan-customization',
        question: 'Can I customize my AI-generated study plan?',
        answer: 'Absolutely! While our AI creates an optimized plan, you can modify time slots, adjust subject priorities, change daily hours, and add personal preferences. The AI will adapt future recommendations based on your customizations while maintaining the overall strategy for exam success.',
        tags: ['customization', 'flexibility', 'planning']
      },
      {
        id: 'multiple-exams',
        question: 'Can I prepare for multiple exams simultaneously?',
        answer: 'Yes, EduAI supports multi-exam preparation. You can create separate study plans for different exams or create a combined plan if exams have overlapping syllabi. The AI will optimize your schedule to avoid conflicts and ensure adequate preparation for each exam based on their respective timelines and importance.',
        tags: ['multiple exams', 'planning', 'schedule']
      },
      {
        id: 'plan-updates',
        question: 'How often should I update my study plan?',
        answer: 'We recommend reviewing your study plan weekly and making adjustments based on your progress. The AI automatically suggests plan modifications based on your performance data. Major updates should be made if your exam date changes, if you consistently over/under-perform, or if your available study time changes significantly.',
        tags: ['updates', 'planning', 'frequency']
      },
      {
        id: 'weak-subjects',
        question: 'How does the AI handle my weak subjects?',
        answer: 'The AI identifies weak subjects through your performance data and allocates 40% more time to these areas. It creates targeted improvement strategies, suggests specific resources, provides additional practice questions, and monitors progress closely. The AI also schedules regular revision of weak topics to ensure retention.',
        tags: ['weak subjects', 'improvement', 'strategy']
      }
    ],
    technical: [
      {
        id: 'system-requirements',
        question: 'What are the system requirements for using EduAI?',
        answer: 'EduAI works on any device with a modern web browser (Chrome, Firefox, Safari, Edge). Minimum requirements: 2GB RAM, stable internet connection (1 Mbps+), and updated browser. For optimal experience, we recommend 4GB+ RAM and 5 Mbps+ internet speed. The platform is fully responsive and works on smartphones, tablets, and computers.',
        tags: ['requirements', 'browser', 'performance']
      },
      {
        id: 'file-upload-issues',
        question: 'I\'m having trouble uploading files. What should I do?',
        answer: 'Common solutions: 1) Ensure file size is under 10MB, 2) Use supported formats (PDF, DOC, DOCX, TXT), 3) Check your internet connection, 4) Try a different browser, 5) Clear browser cache. If issues persist, try uploading one file at a time or contact our technical support team.',
        tags: ['upload', 'files', 'troubleshooting']
      },
      {
        id: 'slow-performance',
        question: 'The platform seems slow. How can I improve performance?',
        answer: 'To improve performance: 1) Close unnecessary browser tabs, 2) Clear browser cache and cookies, 3) Ensure stable internet connection, 4) Use latest browser version, 5) Disable browser extensions temporarily, 6) Try incognito/private browsing mode. If problems persist, contact support with your device and browser details.',
        tags: ['performance', 'speed', 'optimization']
      },
      {
        id: 'data-sync',
        question: 'My data isn\'t syncing across devices. What\'s wrong?',
        answer: 'Data sync issues can occur due to: 1) Poor internet connection, 2) Browser cache issues, 3) Multiple sessions open simultaneously. Solutions: Refresh the page, log out and log back in, clear browser data, or wait a few minutes for automatic sync. All data is saved to cloud servers and should sync within 30 seconds.',
        tags: ['sync', 'devices', 'data']
      }
    ],
    billing: [
      {
        id: 'pricing-plans',
        question: 'What are the different pricing plans available?',
        answer: 'EduAI offers flexible pricing: Free Plan (basic features, limited AI interactions), Student Plan (₹999/month - full AI features, unlimited content), Premium Plan (₹1,999/month - priority support, advanced analytics), and Institutional Plans (custom pricing for schools/coaching centers). All plans include core study planning and progress tracking.',
        tags: ['pricing', 'plans', 'subscription']
      },
      {
        id: 'payment-methods',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major payment methods including credit/debit cards (Visa, MasterCard, RuPay), UPI payments, net banking, digital wallets (Paytm, PhonePe, Google Pay), and bank transfers. International students can pay via PayPal or international cards. All transactions are secured with 256-bit SSL encryption.',
        tags: ['payment', 'methods', 'security']
      },
      {
        id: 'refund-policy',
        question: 'What is your refund policy?',
        answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied with EduAI within 30 days of purchase, contact our support team for a full refund. Refunds are processed within 5-7 business days. The policy applies to first-time subscribers and doesn\'t cover renewal periods.',
        tags: ['refund', 'policy', 'guarantee']
      },
      {
        id: 'subscription-management',
        question: 'How do I manage my subscription or cancel it?',
        answer: 'You can manage your subscription from Settings > Account & Billing. Here you can upgrade, downgrade, pause, or cancel your subscription. Cancellations take effect at the end of your current billing cycle, and you retain access until then. You can also export all your data before cancellation.',
        tags: ['subscription', 'cancel', 'management']
      }
    ],
    exams: [
      {
        id: 'upsc-preparation',
        question: 'How effective is EduAI for UPSC Civil Services preparation?',
        answer: 'EduAI has helped 50,000+ UPSC aspirants with a 92% success rate in clearing prelims and 87% in mains. Our AI understands UPSC\'s unique requirements including current affairs integration, answer writing practice, and optional subject preparation. The platform provides UPSC-specific study schedules, mock tests, and expert guidance from former UPSC trainers.',
        tags: ['UPSC', 'civil services', 'success rate']
      },
      {
        id: 'jee-neet-prep',
        question: 'Is EduAI suitable for JEE and NEET preparation?',
        answer: 'Yes! EduAI has specialized modules for JEE and NEET with 94% success rate. The AI creates subject-wise study plans for Physics, Chemistry, Mathematics (JEE) and Biology (NEET), provides formula sheets, generates practice questions, and tracks topic-wise progress. Our platform includes previous year question analysis and difficulty-based practice sessions.',
        tags: ['JEE', 'NEET', 'engineering', 'medical']
      },
      {
        id: 'exam-specific-features',
        question: 'What exam-specific features does EduAI provide?',
        answer: 'Each exam type gets customized features: UPSC (current affairs integration, answer writing practice), JEE/NEET (formula banks, numerical problem solving), Banking (quantitative aptitude focus, reasoning practice), SSC (general awareness updates, English improvement), CAT (data interpretation, logical reasoning). The AI adapts question patterns and difficulty levels accordingly.',
        tags: ['features', 'customization', 'exam types']
      },
      {
        id: 'exam-timeline',
        question: 'How far in advance should I start using EduAI for my exam?',
        answer: 'The optimal timeline depends on your exam: UPSC (12-18 months), JEE/NEET (24 months), Banking/SSC (6-12 months), CAT (12 months). However, EduAI can create effective plans for any timeline. Even with 3-6 months remaining, our AI can create intensive preparation strategies. The earlier you start, the more comprehensive and stress-free your preparation becomes.',
        tags: ['timeline', 'preparation', 'planning']
      }
    ]
  };

  const allFAQs = Object.values(faqs).flat();
  const currentFAQs = faqs[activeCategory as keyof typeof faqs] || [];

  const filteredFAQs = searchTerm 
    ? allFAQs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : currentFAQs;

  const toggleFAQ = (faqId: string) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": "EduAI Frequently Asked Questions",
    "description": "Find answers to common questions about EduAI's AI-powered exam preparation platform",
    "mainEntity": allFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <SEOHead
        title="FAQ - Frequently Asked Questions | EduAI AI-Powered Exam Preparation"
        description="Find answers to common questions about EduAI's AI-powered exam preparation platform. Get help with features, pricing, technical issues, and exam-specific guidance."
        keywords="EduAI FAQ, exam preparation questions, AI tutoring help, study platform support, competitive exam guidance, EdTech platform help"
        structuredData={structuredData}
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
            Get Answers to Your 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Find comprehensive answers to the most common questions about EduAI's features, 
            AI capabilities, exam preparation strategies, and platform usage.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for answers... (e.g., 'AI mentor', 'study plan', 'UPSC')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-800 placeholder-slate-400"
            />
          </div>
          {searchTerm && (
            <div className="mt-3 text-center">
              <span className="text-slate-600 text-sm">
                Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for "{searchTerm}"
              </span>
            </div>
          )}
        </div>

        {/* Category Navigation */}
        {!searchTerm && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-12">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:scale-102'
                  }`}
                >
                  <category.icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium text-sm">{category.name}</div>
                  <div className="text-xs opacity-75 mt-1">{category.count} questions</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div key={faq.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">{faq.question}</h3>
                      <div className="flex flex-wrap gap-2">
                        {faq.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    {openFAQ === faq.id ? (
                      <ChevronUp className="w-6 h-6 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                </button>
                
                {openFAQ === faq.id && (
                  <div className="px-6 pb-6">
                    <div className="pl-12 pr-4 max-[400px]:p-1">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                        <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-slate-800 mb-4">No Results Found</h3>
              <p className="text-slate-600 mb-6">
                We couldn't find any FAQs matching "{searchTerm}". Try different keywords or browse categories above.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Still Need Help Section */}
        <div className="max-[400px]:p-6 mt-16 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our expert support team is ready to provide personalized assistance.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-700/50 rounded-2xl p-6 border border-slate-600">
              <Brain className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Mentor Chat</h3>
              <p className="text-slate-300 text-sm mb-4">Get instant answers from our expert mentor</p>
              <a
                href="/app/ai-mentor"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Now</span>
              </a>
            </div>
            
            <div className="bg-slate-700/50 rounded-2xl p-6 border border-slate-600">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Expert Consultation</h3>
              <p className="text-slate-300 text-sm mb-4">Schedule a call with our education experts</p>
              <a
                href="/contact"
                className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Schedule Call</span>
              </a>
            </div>
            
            <div className="bg-slate-700/50 rounded-2xl p-6 border border-slate-600">
              <Star className="w-8 h-8 text-purple-400 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Community Support</h3>
              <p className="text-slate-300 text-sm mb-4">Connect with fellow students and mentors</p>
              <a
                href="/app/community"
                className="inline-flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>Join Community</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="mailto:support@eduai.com"
              className="inline-flex items-center space-x-2 bg-white text-slate-800 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Mail className="w-5 h-5" />
              <span>Email Support</span>
            </a>
            <a
              href="/how-to-use"
              className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-slate-800 transition-all duration-300 transform hover:scale-105"
            >
              <BookOpen className="w-5 h-5" />
              <span>User Guide</span>
            </a>
          </div>
        </div>

        {/* Popular Questions */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">Most Popular Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                question: "How accurate is the AI mentor?",
                category: "AI Features",
                popularity: "95%",
                icon: Brain
              },
              {
                question: "What's the success rate for UPSC?",
                category: "Exam Specific",
                popularity: "92%",
                icon: Target
              },
              {
                question: "Is my data secure?",
                category: "General",
                popularity: "89%",
                icon: Shield
              },
              {
                question: "How to upload study materials?",
                category: "Technical",
                popularity: "87%",
                icon: BookOpen
              },
              {
                question: "Can I get a refund?",
                category: "Billing",
                popularity: "84%",
                icon: Award
              },
              {
                question: "How to customize study plans?",
                category: "Study Planning",
                popularity: "82%",
                icon: Lightbulb
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-4">
                  <item.icon className="w-6 h-6 text-blue-600" />
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">{item.category}</span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-3">{item.question}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm">Popularity: {item.popularity}</span>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View Answer →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;