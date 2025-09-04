import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, Brain, Calendar, BookOpen, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickStartGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickStartGuide: React.FC<QuickStartGuideProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to EduAI!',
      description: 'Let\'s get you started with your AI-powered exam preparation journey.',
      action: 'Get Started',
      icon: Brain,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Create Your Study Plan',
      description: 'Generate a personalized study schedule based on your exam and timeline.',
      actionLink: 'Create Plan',
      action: 'Next',
      icon: Calendar,
      color: 'from-green-500 to-emerald-600',
      onClick: () => navigate('/app/enhanced-schedule')
    },
    {
      title: 'Explore Your Courses',
      description: 'Browse your subjects and start learning with AI-powered content.',
      actionLink: 'View Courses',
      action: 'Next',
      icon: BookOpen,
      color: 'from-purple-500 to-violet-600',
      onClick: () => navigate('/app/courses')
    },
    {
      title: 'Track Your Progress',
      description: 'Monitor your performance with real-time analytics and insights.',
      actionLink: 'View Analytics',
      action: 'Finish',
      icon: Target,
      color: 'from-orange-500 to-red-600',
      onClick: () => navigate('/app/analytics')
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleStepNext = () => {
      handleNext();
  };
  
  const handleStepAction = () => {
    const step = steps[currentStep];
    if (step.onClick) {
      step.onClick();
      onClose();
    } else {
      handleNext();
    }
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        <div className="text-center">
          <div className={`w-16 h-16 bg-gradient-to-r ${currentStepData.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
            <currentStepData.icon className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-4">{currentStepData.title}</h2>
          <p className="text-slate-600 leading-relaxed mb-8">{currentStepData.description}</p>

          <div className="flex items-center justify-center space-x-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep ? 'bg-blue-600 scale-125' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          <div className="space-y-4">
            <button
              onClick={handleStepAction}
              className={`w-full bg-gradient-to-r ${currentStepData.color} text-white py-3 px-6 max-px-4 max-py-1 max-text-xs rounded-xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-102 flex items-center justify-center space-x-2`}
            >
              <span>{currentStepData.actionLink}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            
            <button
              onClick={handleStepNext}
              className={`w-full bg-gradient-to-r ${currentStepData.color} text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-102 flex items-center justify-center space-x-2`}
            >
              <span>{currentStepData.action}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="w-full border border-slate-300 text-slate-700 py-3 px-6 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Previous
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full text-slate-500 hover:text-slate-700 transition-colors text-sm"
            >
              Skip tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStartGuide;