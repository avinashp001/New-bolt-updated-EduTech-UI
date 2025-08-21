import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  color: 'orange' | 'green' | 'purple';
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  color,
}) => {
  const colorClasses = {
    orange: 'bg-orange-50 border-orange-100',
    green: 'bg-green-50 border-green-100',
    purple: 'bg-purple-50 border-purple-100',
  };

  const iconColorClasses = {
    orange: 'text-orange-600 bg-orange-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
  };

  return (
    <div className={`p-4 lg:p-6 rounded-2xl border ${colorClasses[color]} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${iconColorClasses[color]}`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-xs lg:text-sm font-medium text-slate-600">{title}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl lg:text-3xl font-bold text-slate-800">{value}</h3>
        <div className="flex items-center space-x-1">
          {changeType === 'positive' ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-xs lg:text-sm font-medium ${
            changeType === 'positive' ? 'text-green-500' : 'text-red-500'
          }`}>
            {change}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;