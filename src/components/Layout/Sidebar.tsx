import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserButton } from '@clerk/clerk-react';
import { 
  Home, 
  Calendar, 
  BookOpen, 
  Video, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut,
  Brain,
  Target,
  Clock
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/app/dashboard' },
    { id: 'courses', icon: BookOpen, label: 'My Courses', path: '/app/courses' },
    { id: 'schedule', icon: Calendar, label: 'Study Planner', path: '/app/enhanced-schedule' },
    { id: 'weekly-tracker', icon: Target, label: 'Weekly Assessment', path: '/app/weekly-tracker' },
    { id: 'timer-session', icon: Clock, label: 'Study Timer', path: '/app/timer-session' },
    { id: 'generate-theory', icon: BookOpen, label: 'Generate Theory', path: '/app/generate-theory' },
    { id: 'ai-test', icon: Brain, label: 'AI Assessment', path: '/app/ai-test' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/app/analytics' },
    { id: 'ai-mentor', icon: Brain, label: 'AI Mentor', path: '/app/ai-mentor' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/app/settings' },
  ];

  const bottomItems = [
    { id: 'support', icon: HelpCircle, label: 'Help & Support', path: '/faq' },
    { id: 'logout', icon: LogOut, label: 'Log Out', path: null },
  ];

  const handleItemClick = (item: any) => {
    if (item.id === 'logout') {
      signOut();
    } else if (item.id === 'support') {
      window.open('/faq', '_blank');
    } else if (item.path) {
      navigate(item.path);
    }
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const isActiveRoute = (path: string) => {
    if (path === '/app/dashboard') {
      return location.pathname === '/app' || location.pathname === '/app/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`bg-slate-900 dark:bg-slate-950 h-screen w-64 fixed left-0 top-0 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Mobile close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:text-slate-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Logo */}
        <div className="p-6 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">EduAI</span>
            </div>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard: "shadow-xl border border-slate-600 bg-slate-800",
                  userButtonPopoverActionButton: "hover:bg-slate-700 text-slate-200"
                }
              }}
              afterSignOutUrl="/"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4"
        style={{
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
        }}>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActiveRoute(item.path)
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4">
          <ul className="space-y-2">
            {bottomItems.filter(item => item.id !== 'logout').map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;