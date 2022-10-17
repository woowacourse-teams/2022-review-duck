import React, { createContext, useMemo, useState, useEffect } from 'react';

import useThrottle from 'common/hooks/useThrottle';

export const UserAgentContext = createContext({ isMobile: false, isPwa: false });

interface UserAgentProviderProps {
  children: React.ReactNode;
}

const BREAK_POINT_MOBILE = 480;

function UserAgentProvider({ children }: UserAgentProviderProps) {
  const setThrottle = useThrottle();
  const [userAgent, setUserAgent] = useState({ isMobile: false, isPwa: false });
  const userAgentMemo = useMemo(() => userAgent, [...Object.values(userAgent)]);

  const handleResizeWindow = () => {
    const isMobile = BREAK_POINT_MOBILE >= document.body.clientWidth;

    setUserAgent((prevState) => {
      if (isMobile === prevState.isMobile) {
        return prevState;
      }

      return { ...prevState, isMobile };
    });
  };

  useEffect(function addWindowSizeObserve() {
    handleResizeWindow();
    window.addEventListener('resize', () => setThrottle(handleResizeWindow, 1000));

    return () => {
      window.removeEventListener('resize', handleResizeWindow);
    };
  }, []);

  return <UserAgentContext.Provider value={userAgentMemo}>{children}</UserAgentContext.Provider>;
}

export default UserAgentProvider;
