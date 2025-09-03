// import React from 'react';
// import { Brain, Target } from 'lucide-react';

// interface LoadingOverlayProps {
//   isOpen: boolean;
//   title: string;
//   message: string;
// }

// const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isOpen, title, message }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
//         <div className="flex justify-center mb-4">
//           <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600"></div>
//         </div>
//         <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
//         <p className="text-slate-600 text-base">{message}</p>
        
//         <div className="flex items-center justify-center space-x-6 text-slate-500">
//           <div className="flex items-center space-x-2">
//             <Brain className="w-5 h-5 text-blue-600" />
//             <span>AI Optimization</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Target className="w-5 h-5 text-purple-600" />
//             <span>Personalization</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoadingOverlay;


import React from 'react';
import { Brain, RocketIcon, Target, AlertTriangle } from 'lucide-react';

interface LoaderOverlayProps {
  isOpen: boolean;
  message?: string;
  subMessage?: string;
}

const LoaderOverlay: React.FC<LoaderOverlayProps> = ({ isOpen, message, subMessage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black mb-2 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-3">
          {message || 'Creating Your Schedule'}
        </h3>
        <p className="text-slate-600 text-sm lg:text-base mb-6">
          {subMessage || 'Analyzing your preferences and generating a personalized day-by-day study plan... It will take few minutes'}
        </p>
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2 text-slate-500">
            <RocketIcon className="w-4 h-4" />
            <span className="text-sm">Optimization</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-500">
            <Target className="w-4 h-4" />
            <span className="text-sm">Personalization</span>
          </div>
        </div>
        <div className="flex items-center mt-4 mx-auto space-x-2 font-bold text-slate-500">
          <AlertTriangle className="w-4 h-4 text-orange-600 font-bold"/>
          <span className="text-sm font-italic text-orange-500">Do not go back while your schedule is generating</span>
        </div>
      </div>
    </div>
  );
};

export default LoaderOverlay;

