import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/Auth/AuthForm';
import App from './App';
import Dashboard from './components/Dashboard/Dashboard';
import RealTimeAnalytics from './components/Dashboard/RealTimeAnalytics';
import EnhancedAIMentor from './components/AIComponents/EnhancedAIMentor';
import StudyPlanGenerator from './components/StudyPlan/StudyPlanGenerator';
import EnhancedScheduleGenerator from './components/StudyPlan/EnhancedScheduleGenerator';
import StudySessionTracker from './components/StudySession/StudySessionTracker';
import AITestSession from './components/StudySession/AITestSession';
import WeeklyPlanTracker from './components/StudyPlan/WeeklyPlanTracker';
import SettingsPage from './components/Settings/SettingsPage';
import CourseList from './components/Courses/CourseList';
import CourseDetail from './components/Courses/CourseDetail';
import TheoryView from './components/Courses/TheoryView';
import TheoryQuizSession from './components/Courses/TheoryQuizSession';
import EnhancedDashboard from './components/Dashboard/EnhancedDashboard';
import LandingPage from './components/Pages/LandingPage';
import AboutPage from './components/Pages/AboutPage';
import ContactPage from './components/Pages/ContactPage';
import FAQPage from './components/Pages/FAQPage';
import HowToUsePage from './components/Pages/HowToUsePage';
import PrivacyPage from './components/Pages/PrivacyPage';
import TermsPage from './components/Pages/TermsPage';
import PublicLayout from './components/Layout/PublicLayout';
import GetStartedPage from './components/Pages/GetStartedPage';
import FeaturesPage from './components/Pages/FeaturesPage';
import PricingPage from './components/Pages/PricingPage';
import PaymentPage from './components/Payment/PaymentPage'; // NEW
import OnboardingSetup from './components/Onboarding/OnboardingSetup'
import RootRedirector from './components/Common/RootRedirector';
import ExamCategoryPage from './components/Pages/ExamCategoryPage';
import TheoryGeneratorPage from './components/Theory/TheoryGeneratorPage';
import ScrollToTop from './components/Common/ScrollToTop';

// Auth Layout Component - handles authentication checks
const AuthLayout: React.FC = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!isLoaded || loading || (isSignedIn && !user)) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Setting up your account...</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    // Redirect to get started page for better onboarding
    return <Navigate to="/get-started" replace />;
  }

  // Check if user has completed onboarding (target_exam is set)
  if (user && (!user.target_exam || user.target_exam.trim() === '')) {
    // User is signed in but hasn't completed onboarding
    // console.log('User needs onboarding, redirecting to /app/onboarding');
    // return <Navigate to="/app/onboarding" replace />;
    console.log('User needs onboarding, rendering OnboardingSetup directly');
    return <OnboardingSetup />;
  } else if (user && user.target_exam) {
    return <Nvigate to="/app/dashboard" replace />
  } 

  console.log('User authenticated and onboarded, rendering main app');
   return (
    <>
      <ScrollToTop /> 
      <App />
    </>
  );
};

// Dashboard wrapper to pass userId
const DashboardWrapper: React.FC = () => {
  const { user } = useAuth();
  return <EnhancedDashboard />;
};

// Analytics wrapper to pass userId
const AnalyticsWrapper: React.FC = () => {
  const { user } = useAuth();
  return <RealTimeAnalytics userId={user?.id || ''} />;
};

// Theory View wrapper to get params and pass userId
const TheoryViewWrapper: React.FC = () => {
  const { user } = useAuth();
  return <TheoryView userId={user?.id || ''} />;
};

// Theory Quiz Session wrapper
const TheoryQuizSessionWrapper: React.FC = () => {
  return <TheoryQuizSession />;
};

// Weekly Plan Tracker wrapper to handle location state
const WeeklyPlanTrackerWrapper: React.FC = () => {
  return <WeeklyPlanTracker />;
};

// Course List wrapper with navigation
const CourseListWrapper: React.FC = () => {
  return (
    <div className="space-y-6">
      <CourseList />
    </div>
  );
};

// Create the router configuration
export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes with Layout */}
      <Route path="/" element={<PublicLayout />}>
        {/* <Route index element={<LandingPage />} /> */}
        <Route index element={<RootRedirector />} /> 
        <Route path="get-started" element={<GetStartedPage />} />
        <Route path="features" element={<FeaturesPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="payment" element={<PaymentPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="how-to-use" element={<HowToUsePage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="exams/:examType" element={<ExamCategoryPage />} /> 
      </Route>
      
      {/* Auth Route */}
      <Route path="/login" element={<AuthForm />} />
      
      {/* Protected Routes */}
      <Route path="/app" element={<AuthLayout />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="onboarding" element={<OnboardingSetup />} />
        <Route path="dashboard" element={<DashboardWrapper />} />
        <Route path="analytics" element={<AnalyticsWrapper />} />
        <Route path="ai-mentor" element={<EnhancedAIMentor />} />
        <Route path="schedule" element={<StudyPlanGenerator />} />
        <Route path="enhanced-schedule" element={<EnhancedScheduleGenerator />} />
        <Route path="weekly-tracker" element={<WeeklyPlanTrackerWrapper />} />
        <Route path="timer-session" element={<StudySessionTracker />} />
        <Route path="ai-test" element={<AITestSession />} />
        <Route path="courses" element={<CourseListWrapper />} />
        <Route path="courses/:subject" element={<CourseDetail />} />
        <Route path="courses/:subject/theory/:topic" element={<TheoryViewWrapper />} />
        <Route path="courses/:subject/theory-quiz/:topic" element={<TheoryQuizSessionWrapper />} />
        <Route path="generate-theory" element={<TheoryGeneratorPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      {/* Redirect old routes to new structure */}
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/analytics" element={<Navigate to="/app/analytics" replace />} />
      <Route path="/ai-mentor" element={<Navigate to="/app/ai-mentor" replace />} />
      <Route path="/courses" element={<Navigate to="/app/courses" replace />} />
      <Route path="/timer-session" element={<Navigate to="/app/timer-session" replace />} />
      <Route path="/ai-test" element={<Navigate to="/app/ai-test" replace />} />
      <Route path="/enhanced-schedule" element={<Navigate to="/app/enhanced-schedule" replace />} />
      <Route path="/weekly-tracker" element={<Navigate to="/app/weekly-tracker" replace />} />
      <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
);