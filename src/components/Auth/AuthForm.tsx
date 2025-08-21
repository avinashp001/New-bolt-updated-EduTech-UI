import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 lg:p-8">
      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Home</span>
      </Link>
      
      <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl lg:text-2xl font-bold text-slate-800">EduAI</span>
          </div>
          <h2 className="text-lg lg:text-xl font-semibold text-slate-700">
            {isSignUp ? 'Create your account' : 'Welcome back!'}
          </h2>
          <p className="text-slate-500 mt-2 text-sm lg:text-base">
            {isSignUp ? 'Start your exam preparation with AI' : 'Sign in to continue your learning journey'}
          </p>
        </div>

        <div className="flex justify-center">
          {isSignUp ? (
            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
                  card: 'shadow-none',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                }
              }}
              redirectUrl="/app/onboarding"
              afterSignUpUrl="/app/onboarding"
            />
          ) : (
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
                  card: 'shadow-none',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                }
              }}
              redirectUrl="/app/dashboard"
              afterSignInUrl="/app/dashboard"
            />
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm lg:text-base"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
        
        {/* Additional Links */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
            <Link to="/privacy" className="hover:text-slate-700 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-700 transition-colors">Terms of Service</Link>
          </div>
          <div className="text-xs text-slate-400">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;