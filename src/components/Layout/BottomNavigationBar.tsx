import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, UserCircle, LibraryBig, BookOpenCheck } from 'lucide-react';

const BottomNavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/app/dashboard' },
    { id: 'courses', label: 'Courses', icon: LibraryBig, path: '/app/courses' },
    { id: 'assessment', label: 'Assessment', icon: BookOpenCheck, path: '/app/weekly-tracker' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, path: '/app/enhanced-schedule' },
    { id: 'ai-mentor', label: 'Mentor', icon: UserCircle, path: '/app/ai-mentor' },
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/app/dashboard') {
      return location.pathname === '/' || location.pathname === '/app/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 lg:hidden z-50 shadow-lg">
      {/* Define the gradient once, globally */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="navGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />   {/* tailwind blue-500 */}
            <stop offset="100%" stopColor="#9333ea" /> {/* tailwind purple-600 */}
          </linearGradient>
        </defs>
      </svg>

      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const active = isActiveRoute(item.path);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center flex-1 h-full text-sm font-medium"
              aria-label={item.label}
            >
              {/* Icon: use gradient stroke when active; otherwise inherit currentColor */}
              <item.icon
                className="max-[450px]:w-5 max-[450px]:h-5 w-6 h-6 mb-1 transition-transform duration-200"
                stroke={active ? 'url(#navGradient)' : 'currentColor'}
                // optional subtle emphasis on active
                style={{ transform: active ? 'scale(1.05)' : undefined }}
              />

              {/* Label: gradient text when active */}
              <span
                className={`max-[450px]:text-xs font-bold transition-colors duration-200 ${
                  active
                    ? 'text-transparent font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text'
                    : 'text-grey-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-300'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigationBar;
