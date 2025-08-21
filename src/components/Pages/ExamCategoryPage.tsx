// src/components/Pages/ExamCategoryPage.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Brain, Target, CheckCircle, ArrowRight } from 'lucide-react';
import SEOHead from '../SEO/SEOHead';

const ExamCategoryPage: React.FC = () => {
  const { examType } = useParams<{ examType: string }>();
  const decodedExamType = examType ? decodeURIComponent(examType).replace(/-/g, ' ') : 'Unknown Exam';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <SEOHead
        title={`${decodedExamType} Preparation - EduAI | AI-Powered Study`}
        description={`Explore AI-powered study plans, resources, and mentorship for ${decodedExamType} exam preparation with EduAI.`}
        keywords={`${decodedExamType} exam, ${decodedExamType} preparation, AI study, competitive exam, online coaching`}
      />

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Exam Category</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
            {decodedExamType}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Welcome to the dedicated page for <strong>{decodedExamType}</strong> exam preparation.
            Our AI-powered platform is designed to help you master this exam with personalized strategies and resources.
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center space-x-3">
            <Brain className="w-6 h-6 text-blue-600" />
            <span>What You'll Find Here</span>
          </h2>
          <ul className="space-y-4 text-slate-700 leading-relaxed">
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <span><strong>Personalized Study Plans</strong>: Generate a tailored study schedule specifically for the {decodedExamType} exam, adapting to your strengths and weaknesses.</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <span><strong>AI Mentor Support</strong>: Get expert guidance and answers to your questions from our AI mentor, trained on competitive exam patterns.</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <span><strong>Relevant Study Materials</strong>: Access or upload materials relevant to {decodedExamType} and get AI-powered analysis and practice questions.</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <span><strong>Performance Analytics</strong>: Track your progress, identify weak areas, and optimize your study approach with real-time data for {decodedExamType}.</span>
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            to="/get-started"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Target className="w-6 h-6" />
            <span>Start Your {decodedExamType} Preparation</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExamCategoryPage;
