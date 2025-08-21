import React from 'react';
import { FileText, Scale, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import SEOHead from '../SEO/SEOHead';

const TermsPage: React.FC = () => {
  const lastUpdated = 'January 15, 2024';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <SEOHead
        title="Terms of Service - EduAI | Legal Terms & Conditions"
        description="Read EduAI's Terms of Service covering platform usage, user responsibilities, intellectual property, and service agreements for our AI-powered exam preparation platform."
        keywords="EduAI terms of service, legal terms, user agreement, platform terms, educational technology terms, AI platform legal"
      />

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            <span>Legal Terms & Conditions</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Please read these Terms of Service carefully before using EduAI. 
            By accessing our platform, you agree to be bound by these terms.
          </p>
          <div className="mt-6 text-sm text-slate-500">
            Last updated: {lastUpdated}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-8 lg:p-12 prose prose-slate max-w-none">
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-bold text-amber-800 m-0">Important Notice</h2>
              </div>
              <p className="text-amber-700 m-0">
                These Terms of Service constitute a legally binding agreement between you and EduAI. 
                Please read them carefully and contact us if you have any questions before using our services.
              </p>
            </div>

            <h2>1. Acceptance of Terms</h2>
            
            <p>
              By accessing, browsing, or using the EduAI platform ("Service"), you acknowledge that you have read, 
              understood, and agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. 
              If you do not agree to these Terms, please do not use our Service.
            </p>

            <h2>2. Description of Service</h2>
            
            <p>
              EduAI is an AI-powered educational technology platform that provides:
            </p>
            <ul>
              <li>Personalized study plans and schedules</li>
              <li>AI-powered mentorship and guidance</li>
              <li>Real-time analytics and progress tracking</li>
              <li>Content analysis and question generation</li>
              <li>Performance assessment and improvement recommendations</li>
            </ul>

            <h2>3. User Eligibility & Account Registration</h2>
            
            <h3>3.1 Eligibility</h3>
            <ul>
              <li>You must be at least 13 years old to use EduAI</li>
              <li>Users under 18 must have parental consent</li>
              <li>You must provide accurate and complete information during registration</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
            </ul>

            <h3>3.2 Account Responsibilities</h3>
            <ul>
              <li>You are responsible for all activities under your account</li>
              <li>You must notify us immediately of any unauthorized access</li>
              <li>You may not share your account credentials with others</li>
              <li>You must keep your contact information current and accurate</li>
            </ul>

            <h2>4. Acceptable Use Policy</h2>
            
            <h3>4.1 Permitted Uses</h3>
            <p>You may use EduAI for:</p>
            <ul>
              <li>Personal educational and exam preparation purposes</li>
              <li>Uploading your own study materials for analysis</li>
              <li>Accessing AI-generated study recommendations</li>
              <li>Tracking your academic progress and performance</li>
            </ul>

            <h3>4.2 Prohibited Activities</h3>
            <p>You agree NOT to:</p>
            <ul>
              <li>Upload copyrighted materials without proper authorization</li>
              <li>Attempt to reverse engineer or copy our AI algorithms</li>
              <li>Use the platform for any illegal or unauthorized purposes</li>
              <li>Interfere with or disrupt the platform's operation</li>
              <li>Create multiple accounts to circumvent limitations</li>
              <li>Share or resell access to the platform</li>
            </ul>

            <h2>5. Intellectual Property Rights</h2>
            
            <h3>5.1 EduAI's Intellectual Property</h3>
            <p>
              All content, features, and functionality of the EduAI platform, including but not limited to 
              text, graphics, logos, software, AI algorithms, and study methodologies, are owned by EduAI 
              and protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h3>5.2 User Content</h3>
            <p>
              You retain ownership of any study materials you upload. By uploading content, you grant EduAI 
              a limited license to process, analyze, and generate educational recommendations based on your materials. 
              We do not claim ownership of your uploaded content.
            </p>

            <h2>6. Subscription & Payment Terms</h2>
            
            <h3>6.1 Subscription Plans</h3>
            <ul>
              <li>EduAI offers various subscription plans with different features and limitations</li>
              <li>Subscription fees are charged in advance on a monthly or annual basis</li>
              <li>All fees are non-refundable except as specified in our refund policy</li>
            </ul>

            <h3>6.2 Free Trial</h3>
            <ul>
              <li>New users may be eligible for a free trial period</li>
              <li>Trial limitations and duration are specified during signup</li>
              <li>You may cancel before the trial ends to avoid charges</li>
            </ul>

            <h3>6.3 Refund Policy</h3>
            <ul>
              <li>30-day money-back guarantee for first-time subscribers</li>
              <li>Refunds processed within 5-7 business days</li>
              <li>Refund eligibility subject to fair usage policies</li>
            </ul>

            <h2>7. AI-Generated Content & Disclaimers</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-bold text-yellow-800 m-0">AI Content Disclaimer</h3>
              </div>
              <ul className="space-y-2 text-yellow-700 m-0">
                <li>• AI-generated content is for educational guidance only</li>
                <li>• Always verify important information with official sources</li>
                <li>• AI recommendations should supplement, not replace, professional guidance</li>
                <li>• Success in exams depends on individual effort and various factors</li>
              </ul>
            </div>

            <h2>8. Limitation of Liability</h2>
            
            <p>
              To the maximum extent permitted by law, EduAI shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, including but not limited to loss of profits, data, 
              or other intangible losses resulting from your use of the Service.
            </p>

            <h2>9. Service Availability</h2>
            
            <ul>
              <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
              <li>Scheduled maintenance will be announced in advance when possible</li>
              <li>We reserve the right to modify or discontinue features with notice</li>
              <li>Emergency maintenance may occur without prior notice</li>
            </ul>

            <h2>10. Termination</h2>
            
            <h3>10.1 Termination by You</h3>
            <ul>
              <li>You may terminate your account at any time through your settings</li>
              <li>Termination is effective at the end of your current billing period</li>
              <li>You may export your data before termination</li>
            </ul>

            <h3>10.2 Termination by EduAI</h3>
            <ul>
              <li>We may suspend or terminate accounts for Terms violations</li>
              <li>We will provide notice when possible before termination</li>
              <li>Serious violations may result in immediate termination</li>
            </ul>

            <h2>11. Governing Law</h2>
            
            <p>
              These Terms are governed by the laws of India. Any disputes will be resolved in the courts 
              of New Delhi, India. For international users, local consumer protection laws may also apply.
            </p>

            <h2>12. Changes to Terms</h2>
            
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of material changes 
              via email or platform notification. Continued use of the Service after changes constitutes 
              acceptance of the new Terms.
            </p>

            <h2>13. Contact Information</h2>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Legal Department</h3>
              <div className="space-y-2 text-slate-700">
                <p><strong>Email:</strong> legal@eduai.com</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Address:</strong> EduAI Legal Department<br />
                123 Education Street<br />
                New Delhi - 110001, India</p>
                <p><strong>Business Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM IST</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-green-800 m-0">Fair Usage Commitment</h3>
              </div>
              <p className="text-green-700 m-0">
                We are committed to fair and transparent terms that protect both our users and our platform. 
                If you have questions about any of these terms, our legal team is available to provide 
                clarification and ensure you understand your rights and responsibilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;