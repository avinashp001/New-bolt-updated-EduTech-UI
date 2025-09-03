import React from 'react';
import { 
  Brain, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube,
  BookOpen,
  Target,
  Users,
  Award,
  Shield,
  FileText,
  HelpCircle,
  MessageSquare,
  Star,
  Clock,
  TrendingUp,
  Zap,
  Globe,
  Heart,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { name: 'AI Study Planner', href: '/app/enhanced-schedule', icon: Target },
    { name: 'Smart Analytics', href: '/app/analytics', icon: TrendingUp },
    { name: 'AI Mentor Chat', href: '/app/ai-mentor', icon: Brain },
    { name: 'Study Timer', href: '/app/timer-session', icon: Clock },
    { name: 'Course Library', href: '/app/courses', icon: BookOpen },
    { name: 'Performance Tests', href: '/app/ai-test', icon: Zap }
  ];

  const examCategories = [
    { name: 'UPSC Civil Services', href: '/exams/upsc', students: '50,000+' },
    { name: 'JEE Main/Advanced', href: '/exams/jee', students: '75,000+' },
    { name: 'NEET Medical', href: '/exams/neet', students: '60,000+' },
    { name: 'SSC CGL/CHSL', href: '/exams/ssc', students: '40,000+' },
    { name: 'Banking (SBI/IBPS)', href: '/exams/banking', students: '35,000+' },
    { name: 'CAT MBA', href: '/exams/cat', students: '25,000+' }
  ];

  const companyLinks = [
    { name: 'About EduAI', href: '/about' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'How to Use', href: '/how-to-use' },
    { name: 'Success Stories', href: '/about#success-stories' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Get Started', href: '/get-started' }
  ];

  const supportLinks = [
    { name: 'Help Center', href: '/help', icon: HelpCircle },
    { name: 'Getting Started', href: '/how-to-use', icon: BookOpen },
    { name: 'Video Tutorials', href: '/how-to-use#videos', icon: Youtube },
    { name: 'FAQ', href: '/faq', icon: MessageSquare },
    { name: 'Contact Support', href: '/contact', icon: Mail },
    { name: 'Community Forum', href: '/contact#community', icon: Users },
    { name: 'Feature Requests', href: '/contact', icon: Star },
    { name: 'Bug Reports', href: '/contact', icon: Shield }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/privacy#cookies' },
    { name: 'Data Protection', href: '/privacy#data-protection' },
    { name: 'Refund Policy', href: '/pricing#refund' },
    { name: 'Academic Integrity', href: '/terms#academic' },
    { name: 'Accessibility', href: '/about#accessibility' },
    { name: 'Compliance', href: '/about#compliance' }
  ];

  const achievements = [
    { number: '500K+', label: 'Students Helped', icon: Users },
    { number: '95%', label: 'Success Rate', icon: Award },
    { number: '50+', label: 'Exam Categories', icon: Target },
    { number: '24/7', label: 'AI Support', icon: Brain }
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        {/* Top Section - Brand & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">EduAI</h3>
                <p className="text-slate-300 text-sm">AI-Powered Education</p>
              </div>
            </div>
            
            <p className="text-slate-300 leading-relaxed mb-6">
              Revolutionizing exam preparation with cutting-edge AI technology. Our platform combines 15+ years of educational expertise with advanced artificial intelligence to provide personalized, data-driven study experiences that guarantee success.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-300">Trusted by 500,000+ students worldwide</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-300">95% success rate in competitive exams</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-300">AI-powered personalized learning paths</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center space-x-4 mt-8">
              <span className="text-slate-400 text-sm">Follow us:</span>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, href: 'https://facebook.com/eduai', label: 'Facebook' },
                  { icon: Twitter, href: 'https://twitter.com/eduai', label: 'Twitter' },
                  { icon: Linkedin, href: 'https://linkedin.com/company/eduai', label: 'LinkedIn' },
                  { icon: Instagram, href: 'https://instagram.com/eduai', label: 'Instagram' },
                  { icon: Youtube, href: 'https://youtube.com/eduai', label: 'YouTube' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="lg:col-span-2">
            <h4 className="text-xl font-bold mb-6 text-center lg:text-left">Our Impact & Achievements</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <achievement.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">{achievement.number}</div>
                  <div className="text-slate-300 text-sm">{achievement.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Products & Features */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span>Products & Features</span>
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors duration-200 group"
                  >
                    <link.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Exam Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-400" />
              <span>Exam Categories</span>
            </h4>
            <ul className="space-y-3">
              {examCategories.map((exam, index) => (
                <li key={index}>
                  <a
                    href={exam.href}
                    className="block text-slate-300 hover:text-white transition-colors duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{exam.name}</span>
                      <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded-full">{exam.students}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Resources */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              <span>Support & Resources</span>
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors duration-200 group"
                  >
                    <link.icon className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-orange-400" />
              <span>Company & Legal</span>
            </h4>
            <ul className="space-y-3">
              {companyLinks.slice(0, 4).map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-slate-700">
                <span className="text-slate-400 text-sm font-medium">Legal</span>
              </li>
              {legalLinks.slice(0, 4).map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-slate-800/50 rounded-2xl p-8 mb-12 border border-slate-700">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>Contact Information</span>
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a href="mailto:support@eduai.com" className="text-slate-300 hover:text-white transition-colors">
                    support@eduai.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <a href="tel:+919876543210" className="text-slate-300 hover:text-white transition-colors">
                    +91 98765 43210
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">New Delhi, India</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-400" />
                <span>Support Hours</span>
              </h4>
              <div className="space-y-2 text-slate-300">
                <div>Monday - Friday: 9:00 AM - 9:00 PM IST</div>
                <div>Saturday: 10:00 AM - 6:00 PM IST</div>
                <div>Sunday: 11:00 AM - 5:00 PM IST</div>
                <div className="text-blue-400 font-medium">24/7 AI Support Available</div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span>Join Our Community</span>
              </h4>
              <p className="text-slate-300 mb-4">
                Connect with fellow students, share experiences, and get expert guidance from our community of successful exam toppers.
              </p>
              <Link
                to="/app/community"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                <Users className="w-4 h-4" />
                <span>Join Community</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-2xl font-bold mb-4">Stay Updated with EduAI</h4>
              <p className="text-blue-100 leading-relaxed">
                Get the latest study tips, exam updates, success stories, and exclusive AI-powered insights delivered to your inbox. Join 100,000+ students who trust our weekly newsletter.
              </p>
            </div>
            <div>
              <form className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-xl border border-blue-300 focus:ring-4 focus:ring-white/20 focus:border-white transition-all duration-300 text-slate-800"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-blue-200 text-xs mt-2">
                No spam, unsubscribe anytime. Read our <Link to="/privacy" className="underline hover:text-white">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>

        {/* Expert Team Section */}
        <div className="mb-12">
          <h4 className="text-xl font-bold mb-6 text-center">Meet Our Expert Team</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 text-center border border-slate-700">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h5 className="font-bold text-white mb-2">Dr. Rajesh Kumar</h5>
              <p className="text-slate-300 text-sm mb-3">Chief AI Mentor & Educational Expert</p>
              <p className="text-slate-400 text-xs">15+ years experience, 10,000+ students mentored to top ranks</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-2xl p-6 text-center border border-slate-700">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h5 className="font-bold text-white mb-2">Prof. Anita Sharma</h5>
              <p className="text-slate-300 text-sm mb-3">Head of Curriculum & Assessment</p>
              <p className="text-slate-400 text-xs">Former UPSC examiner, 20+ years in competitive exam training</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-2xl p-6 text-center border border-slate-700">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h5 className="font-bold text-white mb-2">Dr. Vikram Singh</h5>
              <p className="text-slate-300 text-sm mb-3">AI Research Director</p>
              <p className="text-slate-400 text-xs">PhD in Machine Learning, pioneering AI in education</p>
            </div>
          </div>
        </div>

        {/* Certifications & Trust Signals */}
        <div className="bg-slate-800/30 rounded-2xl p-8 mb-12 border border-slate-700">
          <h4 className="text-xl font-bold mb-6 text-center">Certifications & Trust Signals</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <Shield className="w-8 h-8 text-green-400 mx-auto" />
              <div className="text-sm font-medium">ISO 27001 Certified</div>
              <div className="text-xs text-slate-400">Data Security</div>
            </div>
            <div className="space-y-2">
              <Award className="w-8 h-8 text-blue-400 mx-auto" />
              <div className="text-sm font-medium">EdTech Excellence</div>
              <div className="text-xs text-slate-400">Award 2024</div>
            </div>
            <div className="space-y-2">
              <Users className="w-8 h-8 text-purple-400 mx-auto" />
              <div className="text-sm font-medium">500K+ Students</div>
              <div className="text-xs text-slate-400">Trusted Globally</div>
            </div>
            <div className="space-y-2">
              <Star className="w-8 h-8 text-yellow-400 mx-auto" />
              <div className="text-sm font-medium">4.9/5 Rating</div>
              <div className="text-xs text-slate-400">Student Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-700 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-6">
              <p className="text-slate-400 text-sm">
                © {currentYear} EduAI. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-xs text-slate-500">
                <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
                <span>•</span>
                <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
                <span>•</span>
                <Link to="/cookies" className="hover:text-slate-300 transition-colors">Cookies</Link>
                <span>•</span>
                <Link to="/accessibility" className="hover:text-slate-300 transition-colors">Accessibility</Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <Globe className="w-4 h-4" />
                <span>Made in India with</span>
                <Heart className="w-4 h-4 text-red-400" />
                <span>for students worldwide</span>
              </div>
            </div>
          </div>
          
          {/* Additional Legal & Compliance */}
          <div className="mb-0 max-[600px]:mb-4 mt-6 pt-6 border-t border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-500">
              <div>
                <p className="mb-2">
                  <strong className="text-slate-400">Disclaimer:</strong> EduAI is an educational technology platform. 
                  Success in competitive exams depends on individual effort, preparation quality, and various factors. 
                  Past performance and testimonials do not guarantee future results.
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <strong className="text-slate-400">Data Protection:</strong> We are committed to protecting your privacy 
                  and personal data in accordance with applicable data protection laws including GDPR and India's Personal 
                  Data Protection Act.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;