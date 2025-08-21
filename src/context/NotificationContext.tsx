import React, { createContext, useContext, ReactNode } from 'react';
import { useToast, ToastNotification } from '../components/Common/NotificationToast';

interface NotificationContextType {
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { addNotification, ToastContainer } = useToast();

  const showSuccess = (title: string, message: string) => {
    addNotification({ type: 'success', title, message });
  };

  const showError = (title: string, message: string) => {
    addNotification({ type: 'error', title, message });
  };

  const showInfo = (title: string, message: string) => {
    addNotification({ type: 'info', title, message });
  };

  const showWarning = (title: string, message: string) => {
    addNotification({ type: 'warning', title, message });
  };

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showInfo, showWarning }}>
      {children}
      <ToastContainer />
    </NotificationContext.Provider>
  );
};