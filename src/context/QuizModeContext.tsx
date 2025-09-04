// src/context/QuizModeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuizModeContextType {
  isQuizMode: boolean;
  setQuizMode: (mode: boolean) => void;
}

const QuizModeContext = createContext<QuizModeContextType | undefined>(undefined);

export const useQuizMode = () => {
  const context = useContext(QuizModeContext);
  if (context === undefined) {
    throw new Error('useQuizMode must be used within a QuizModeProvider');
  }
  return context;
};

interface QuizModeProviderProps {
  children: ReactNode;
}

export const QuizModeProvider: React.FC<QuizModeProviderProps> = ({ children }) => {
  const [isQuizMode, setIsQuizMode] = useState(false);

  return (
    <QuizModeContext.Provider value={{ isQuizMode, setQuizMode: setIsQuizMode }}>
      {children}
    </QuizModeContext.Provider>
  );
};

