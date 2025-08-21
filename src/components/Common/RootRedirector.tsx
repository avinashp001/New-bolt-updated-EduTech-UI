import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import LandingPage from '../Pages/LandingPage'; // Render LandingPage if not logged in

const RootRedirector: React.FC = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { user, loading } = useAuth(); // This hook fetches user data from Supabase

  // Show loading state while authentication and user data are being loaded
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading user session...</p>
        </div>
      </div>
    );
  }

  // If signed in, check onboarding status and redirect
  if (isSignedIn) {
    if (user && user.target_exam && user.target_exam.trim() !== '') {
      // User is signed in and onboarded
      return <Navigate to="/app/dashboard" replace />;
    } else {
      // User is signed in but not onboarded
      return <Navigate to="/app/onboarding" replace />;
    }
  }

  // If not signed in, render the LandingPage
  return <LandingPage />;
};

export default RootRedirector;
