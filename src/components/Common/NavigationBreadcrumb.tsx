import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const NavigationBreadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbNameMap: Record<string, string> = {
    'app': 'Dashboard',
    'dashboard': 'Dashboard',
    'courses': 'Courses',
    'analytics': 'Analytics',
    'ai-mentor': 'AI Mentor',
    'enhanced-schedule': 'Study Planner',
    'weekly-tracker': 'Weekly Assessment',
    'timer-session': 'Study Timer',
    'ai-test': 'AI Assessment',
    'settings': 'Settings',
    'theory': 'Theory',
    'about': 'About',
    'contact': 'Contact',
    'faq': 'FAQ',
    'features': 'Features',
    'pricing': 'Pricing',
    'get-started': 'Get Started',
    'how-to-use': 'How to Use',
    'privacy': 'Privacy Policy',
    'terms': 'Terms of Service'
  };

  const getBreadcrumbName = (pathname: string, index: number) => {
    // Handle dynamic routes
    if (pathnames[index - 1] === 'courses' && index === pathnames.length - 1) {
      return decodeURIComponent(pathname);
    }
    if (pathnames[index - 1] === 'theory' && index === pathnames.length - 1) {
      return decodeURIComponent(pathname);
    }
    
    return breadcrumbNameMap[pathname] || pathname;
  };

  const generatePath = (index: number) => {
    return '/' + pathnames.slice(0, index + 1).join('/');
  };

  if (pathnames.length === 0 || location.pathname === '/') {
    return null;
  }

  return (
    <nav className="flex pl-4 items-center space-x-2 text-xs text-slate-600 dark:text-slate-400 mt-4 mb-6">
      <Link 
        to="/" 
        className="flex items-center space-x-1 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>
      
      {pathnames.map((pathname, index) => {
        const routeTo = generatePath(index);
        const isLast = index === pathnames.length - 1;
        const breadcrumbName = getBreadcrumbName(pathname, index);

        return (
          <React.Fragment key={pathname}>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            {isLast ? (
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {breadcrumbName}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                {breadcrumbName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default NavigationBreadcrumb;