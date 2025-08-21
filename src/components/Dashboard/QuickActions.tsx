import React from 'react';
import { BookOpen, Clock, Brain, BarChart3, Calendar, Target, Award, Zap } from 'lucide-react';

interface QuickActionsProps {
  totalCourses: number;
  completedCourses: number;
  pendingStudy: number;
  weeklyHours: number;
  navigate: (path: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  totalCourses,
  completedCourses,
  pendingStudy,
  weeklyHours,
  navigate
}) => {
  const quickStats = [
    {
      title: 'Total Courses',
      value: totalCourses,
      subtitle: `${completedCourses} completed`,
      color: 'from-blue-500 to-blue-600',
      icon: BookOpen,
      action: () => navigate('/app/courses')
    },
    {
      title: 'Weekly Hours',
      value: `${weeklyHours}h`,
      subtitle: 'This week',
      color: 'from-purple-500 to-purple-600',
      icon: Clock,
      action: () => navigate('/app/analytics')
    },
    {
      title: 'Pending Study',
      value: pendingStudy,
      subtitle: pendingStudy === 1 ? 'Subject to focus' : 'Subjects to focus',
      color: 'from-green-500 to-green-600',
      icon: Target,
      action: () => navigate('/app/courses')
    },
    {
      title: 'AI Sessions',
      value: '∞',
      subtitle: 'Available now',
      color: 'from-orange-500 to-orange-600',
      icon: Brain,
      action: () => navigate('/app/ai-test')
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {quickStats.map((stat, index) => (
        <div
          key={index}
          onClick={stat.action}
          className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl text-white cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
        >
          <div className="flex items-center justify-between mb-4">
            <stat.icon className="w-8 h-8 text-white/80" />
            <div className="text-right">
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          </div>
          
          <div>
            <div className="font-semibold text-lg">{stat.title}</div>
            <div className="text-white/80 text-sm">{stat.subtitle}</div>
          </div>
          
          {/* Hover effect indicator */}
          <div className="mt-4 flex items-center justify-end">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickActions;