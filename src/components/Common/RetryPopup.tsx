// src/components/Common/RetryPopup.tsx
import React from 'react';
import { XCircle, RefreshCcw, ArrowLeft } from 'lucide-react';

interface RetryPopupProps {
  isOpen: boolean;
  title: string;
  message: string;
  onTryAgain: () => void;
  onCancel: () => void;
}

const RetryPopup: React.FC<RetryPopupProps> = ({ isOpen, title, message, onTryAgain, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center mb-4">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>
        <h3 className="text-xl lg:text-2xl font-bold text-slate-800">{title}</h3>
        <p className="text-slate-600 text-sm lg:text-base">{message}</p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onTryAgain}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            <RefreshCcw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
          <button
            onClick={onCancel}
            className="flex items-center justify-center space-x-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RetryPopup;
