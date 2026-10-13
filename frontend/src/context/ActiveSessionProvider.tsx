import React, { useCallback, useMemo, useState } from 'react';
import type { PushedRoute } from '../types';
import {
  ActiveSessionContext,
  normalizeRoute,
  type ActiveSessionPushedRoute,
} from './sessionState';

export const ActiveSessionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [pushedRoute, setPushedRoute] = useState<ActiveSessionPushedRoute | null>(null);

  const onPushRoute = useCallback((route: PushedRoute | ActiveSessionPushedRoute) => {
    setPushedRoute(normalizeRoute(route));
  }, []);

  const onClearRoute = useCallback(() => {
    setPushedRoute(null);
  }, []);

  const value = useMemo(
    () => ({
      pushedRoute,
      onPushRoute,
      onClearRoute,
    }),
    [onClearRoute, onPushRoute, pushedRoute]
  );

  return <ActiveSessionContext.Provider value={value}>{children}</ActiveSessionContext.Provider>;
};
