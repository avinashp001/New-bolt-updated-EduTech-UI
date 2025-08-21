import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationToastProps {
  notification: ToastNotification;
  onClose: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);

    // Auto dismiss
    const timer = setTimeout(() => {
      handleClose();
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification.duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      default:
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getColorClasses = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
        isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`rounded-xl shadow-lg border-2 p-4 ${getColorClasses()}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-800">{notification.title}</h4>
            <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Manager Hook
export const useToast = () => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const addNotification = (notification: Omit<ToastNotification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );

  return {
    addNotification,
    removeNotification,
    ToastContainer,
    notifications
  };
};

export default NotificationToast;