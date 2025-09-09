import React from 'react';
import { X, Crown, Zap, CheckCircle, Rocket } from 'lucide-react';

interface UpgradePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  limit: number;
  subscriptionPageUrl?: string;
}

const UpgradePromptModal: React.FC<UpgradePromptModalProps> = ({
  isOpen,
  onClose,
  featureName,
  limit,
  subscriptionPageUrl = '/pricing', // Default to /pricing page
}) => {
  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    window.open(subscriptionPageUrl, '_blank'); // Open in new tab
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Crown className="w-10 h-10 text-white" />
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-4">
          Unlock Unlimited Potential!
        </h3>
        <p className="text-slate-600 leading-relaxed mb-6">
          You've reached the free tier limit of <span className="font-bold text-indigo-600">{limit} {featureName}</span> per day.
          Upgrade to our premium plan to continue your progress without interruption!
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span>Why Upgrade?</span>
          </h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>Unlimited {featureName} usage</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>Access to all premium AI features</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>Faster AI responses & priority support</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>Advanced analytics & personalized insights</span>
            </li>
          </ul>
        </div>

        <button
          onClick={handleUpgradeClick}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
        >
          <Rocket className="w-5 h-5" />
          <span>Upgrade to Premium Now!</span>
        </button>

        <button
          onClick={onClose}
          className="mt-4 text-slate-500 hover:text-slate-700 transition-colors text-sm"
        >
          Maybe later, thanks
        </button>
      </div>
    </div>
  );
};

export default UpgradePromptModal;

