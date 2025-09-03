import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Calendar, Brain, UserCircle, Library, LibraryBig, BookOpenCheck } from 'lucide-react';

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
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={` flex flex-col items-center justify-center flex-1 h-full text-sm font-medium transition-colors duration-200
              ${isActiveRoute(item.path)
                ? 'text-blue-600 dark:text-sky-600'
                : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300'
              }`}
          >
            <item.icon className={`max-[450px]:w-5 max-[450px]:h-5 w-6 h-6 mb-1 ${isActiveRoute(item.path) ? '' : ''}`} />
            <span className='max-[450px]:text-xs'>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigationBar;
