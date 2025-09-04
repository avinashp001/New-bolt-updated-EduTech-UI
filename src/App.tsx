import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from './hooks/useAuth';
import Sidebar from './components/Layout/Sidebar';
import BottomNavigationBar from './components/Layout/BottomNavigationBar';
import Footer from './components/Layout/Footer';
import NavigationBreadcrumb from './components/Common/NavigationBreadcrumb';

function App() {
  const { isSignedIn } = useUser();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading if user is signed in but we don't have user data yet
  if (isSignedIn && !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Setting up your profile...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className={`${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'} lg:p-8 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex ml-4 pt-4 items-center justify-between mb-2">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700"
              >
                <svg
                  className="w-6 h-6 text-slate-600 dark:text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="w-full mx-2 bg-red border border-gray-900 px-4 py-1 rounded-lg">
                <h2 className="text-lg text-white">AI Edu Tech</h2>
              </div>
            </div>
            <NavigationBreadcrumb />
          </div>
          <Outlet />
        </div>
      </main>
      
      <div className={`${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'} transition-all duration-300`}>
        <Footer />
      </div>
      <BottomNavigationBar />
    </div>
  );
}

export default App;