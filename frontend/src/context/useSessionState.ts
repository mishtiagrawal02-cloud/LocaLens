import { useContext } from 'react';
import { ActiveSessionContext } from './sessionState';

export const useSessionState = () => {
  const context = useContext(ActiveSessionContext);

  if (!context) {
    throw new Error('useSessionState must be used within an ActiveSessionProvider');
  }

  return context;
};
