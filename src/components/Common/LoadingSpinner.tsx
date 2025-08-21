import React from 'react';
import { Brain, Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'brain' | 'minimal';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'md',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const containerClasses = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
        {message && <span className="text-slate-600">{message}</span>}
      </div>
    );
  }

  if (variant === 'brain') {
    return (
      <div className={`flex flex-col items-center justify-center ${containerClasses[size]}`}>
        <div className="relative mb-6">
          <div className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 ${sizeClasses[size]}`}></div>
          <Brain className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 ${
            size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'
          }`} />
        </div>
        <h3 className={`font-bold text-slate-800 mb-2 ${
          size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-xl'
        }`}>
          {message.includes('onboarding') || message.includes('study plan') ? 'Setting Up Your Success Journey...' : 'Analyzing...'}
        </h3>
        <p className={`text-slate-600 text-center max-w-md ${
          size === 'sm' ? 'text-xs' : 'text-sm'
        }`}>
          {message}
        </p>
        <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Analyzing</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span>Processing</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <span>Optimizing</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]}`}>
      <div className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mb-4 ${sizeClasses[size]}`}></div>
      <p className={`text-slate-600 text-center ${
        size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
      }`}>
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;