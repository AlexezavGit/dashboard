import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DrillAnswers = Record<string, any> | null;

interface DrilldownContextType {
  answers: DrillAnswers;
  setAnswers: (a: DrillAnswers) => void;
  clear: () => void;
}

const DrilldownContext = createContext<DrilldownContextType | undefined>(undefined);

export const DrilldownProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [answers, setAnswersState] = useState<DrillAnswers>(null);

  const setAnswers = (a: DrillAnswers) => setAnswersState(a);
  const clear = () => setAnswersState(null);

  return (
    <DrilldownContext.Provider value={{ answers, setAnswers, clear }}>
      {children}
    </DrilldownContext.Provider>
  );
};

export const useDrilldown = () => {
  const ctx = useContext(DrilldownContext);
  if (!ctx) throw new Error('useDrilldown must be used within DrilldownProvider');
  return ctx;
};
