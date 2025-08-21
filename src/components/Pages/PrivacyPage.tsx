import React from 'react';
import { Shield, Lock, Eye, Database, Globe, CheckCircle } from 'lucide-react';
import SEOHead from '../SEO/SEOHead';

const PrivacyPage: React.FC = () => {
  const lastUpdated = 'January 15, 2024';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <SEOHead
        title="Privacy Policy - EduAI | Data Protection & Security"
        description="Learn how EduAI protects your privacy and personal data. Our comprehensive privacy policy covers data collection, usage, security measures, and your rights."
        keywords="EduAI privacy policy, data protection, privacy rights, data security, GDPR compliance, student data privacy"
      />

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            <span>Privacy & Data Protection</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Your privacy is our priority. Learn how we collect, use, and protect your personal information 
            while providing you with the best AI-powered educational experience.
          </p>
          <div className="mt-6 text-sm text-slate-500">
            Last updated: {lastUpdated}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-8 lg:p-12 prose prose-slate max-w-none">
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-800 m-0">Key Privacy Commitments</h2>
              </div>
              <ul className="space-y-2 text-blue-700 m-0">
                <li>✓ We never sell your personal data to third parties</li>
                <li>✓ Your study materials and progress data are encrypted and secure</li>
                <li>✓ You have full control over your data with export and deletion options</li>
                <li>✓ We comply with GDPR, CCPA, and India's Personal Data Protection Act</li>
              </ul>
            </div>

            <h2>1. Information We Collect</h2>
            
            <h3>1.1 Personal Information</h3>
            <p>When you create an EduAI account, we collect:</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, phone number (optional)</li>
              <li><strong>Educational Profile:</strong> Target exam, current preparation level, study preferences</li>
              <li><strong>Authentication Data:</strong> Login credentials and security information</li>
            </ul>

            <h3>1.2 Study Data</h3>
            <p>To provide personalized learning experiences, we collect:</p>
            <ul>
              <li><strong>Study Sessions:</strong> Duration, subjects studied, topics covered, performance scores</li>
              <li><strong>Progress Information:</strong> Completion percentages, weak areas, strong areas</li>
              <li><strong>Assessment Results:</strong> Quiz scores, test performance, improvement trends</li>
              <li><strong>Uploaded Materials:</strong> Study documents you choose to upload for AI analysis</li>
            </ul>

            <h3>1.3 Usage Analytics</h3>
            <p>We automatically collect certain information about how you use our platform:</p>
            <ul>
              <li><strong>Platform Usage:</strong> Features used, time spent, navigation patterns</li>
              <li><strong>Device Information:</strong> Browser type, operating system, device characteristics</li>
              <li><strong>Performance Data:</strong> Loading times, error reports, feature effectiveness</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            
            <h3>2.1 Personalized Learning</h3>
            <ul>
              <li>Create customized study plans based on your goals and performance</li>
              <li>Generate AI-powered recommendations and insights</li>
              <li>Adapt content difficulty and pacing to your learning style</li>
              <li>Provide personalized mentorship through our AI mentor</li>
            </ul>

            <h3>2.2 Platform Improvement</h3>
            <ul>
              <li>Analyze usage patterns to improve our AI algorithms</li>
              <li>Enhance platform performance and user experience</li>
              <li>Develop new features based on user needs</li>
              <li>Conduct research to advance AI in education</li>
            </ul>

            <h3>2.3 Communication</h3>
            <ul>
              <li>Send important account and service updates</li>
              <li>Provide study reminders and progress notifications (if enabled)</li>
              <li>Share educational content and tips</li>
              <li>Respond to your support requests and inquiries</li>
            </ul>

            <h2>3. Data Security & Protection</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-6">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-green-800 m-0">Security Measures</h3>
              </div>
              <ul className="space-y-2 text-green-700 m-0">
                <li>• <strong>Encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                <li>• <strong>Access Controls:</strong> Strict role-based access with multi-factor authentication</li>
                <li>• <strong>Regular Audits:</strong> Quarterly security assessments and penetration testing</li>
                <li>• <strong>ISO 27001 Certified:</strong> International standard for information security management</li>
              </ul>
            </div>

            <h2>4. Data Sharing & Third Parties</h2>
            
            <h3>4.1 We DO NOT Share Your Data With:</h3>
            <ul>
              <li>Advertisers or marketing companies</li>
              <li>Data brokers or analytics companies</li>
              <li>Social media platforms</li>
              <li>Any organization for commercial purposes</li>
            </ul>

            <h3>4.2 Limited Sharing for Service Delivery:</h3>
            <ul>
              <li><strong>Cloud Infrastructure:</strong> AWS/Google Cloud for secure data storage</li>
              <li><strong>Authentication:</strong> Clerk for secure user authentication</li>
              <li><strong>Analytics:</strong> Supabase for database management</li>
              <li><strong>AI Processing:</strong> Mistral AI for educational content generation</li>
            </ul>

            <h2>5. Your Privacy Rights</h2>
            
            <h3>5.1 Access & Control</h3>
            <ul>
              <li><strong>Data Access:</strong> View all personal data we have about you</li>
              <li><strong>Data Export:</strong> Download your complete study history and progress</li>
              <li><strong>Data Correction:</strong> Update or correct any inaccurate information</li>
              <li><strong>Data Deletion:</strong> Request complete removal of your account and data</li>
            </ul>

            <h3>5.2 Communication Preferences</h3>
            <ul>
              <li>Opt-out of marketing communications anytime</li>
              <li>Customize notification preferences in your settings</li>
              <li>Choose which types of educational content you receive</li>
            </ul>

            <h2>6. Data Retention</h2>
            
            <p>We retain your data for different periods based on its purpose:</p>
            <ul>
              <li><strong>Account Data:</strong> Until you delete your account</li>
              <li><strong>Study Progress:</strong> 7 years for educational continuity</li>
              <li><strong>Usage Analytics:</strong> 2 years for platform improvement</li>
              <li><strong>Support Communications:</strong> 3 years for service quality</li>
            </ul>

            <h2>7. Children's Privacy</h2>
            
            <p>
              EduAI is designed for students aged 13 and above. We do not knowingly collect personal information 
              from children under 13. If you believe we have collected information from a child under 13, 
              please contact us immediately at privacy@eduai.com.
            </p>

            <h2>8. International Data Transfers</h2>
            
            <p>
              Your data may be processed in countries other than your own. We ensure adequate protection 
              through appropriate safeguards including Standard Contractual Clauses and adequacy decisions. 
              All international transfers comply with applicable data protection laws.
            </p>

            <h2>9. Cookies & Tracking</h2>
            
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Remember your login status and preferences</li>
              <li>Analyze platform usage and performance</li>
              <li>Provide personalized content and recommendations</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>
            
            <p>
              You can control cookie settings through your browser preferences. However, disabling certain 
              cookies may limit platform functionality.
            </p>

            <h2>10. Updates to This Policy</h2>
            
            <p>
              We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. 
              We will notify you of significant changes via email or platform notification. Your continued use of 
              EduAI after such modifications constitutes acceptance of the updated policy.
            </p>

            <h2>11. Contact Information</h2>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Data Protection Officer</h3>
              <div className="space-y-2 text-slate-700">
                <p><strong>Email:</strong> privacy@eduai.com</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Address:</strong> 123 Education Street, New Delhi - 110001, India</p>
                <p><strong>Response Time:</strong> Within 30 days of request</p>
              </div>
            </div>

            <h2>12. Compliance & Certifications</h2>
            
            <p>EduAI complies with:</p>
            <ul>
              <li><strong>GDPR:</strong> European General Data Protection Regulation</li>
              <li><strong>CCPA:</strong> California Consumer Privacy Act</li>
              <li><strong>PDPA:</strong> India's Personal Data Protection Act</li>
              <li><strong>ISO 27001:</strong> Information Security Management</li>
              <li><strong>SOC 2 Type II:</strong> Security and availability controls</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-blue-800 m-0">Transparency Commitment</h3>
              </div>
              <p className="text-blue-700 m-0">
                We believe in complete transparency about how we handle your data. If you have any questions 
                about this Privacy Policy or our data practices, please don't hesitate to contact our 
                Data Protection Officer at privacy@eduai.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;