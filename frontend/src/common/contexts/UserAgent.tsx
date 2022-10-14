import React, { createContext, useMemo, useState, useEffect } from 'react';

import useThrottleCallback from 'common/hooks/ussThrottleCallback';

export const UserAgentContext = createContext({ isMobile: false, isPwa: false });

interface UserAgentProviderProps {
  children: React.ReactNode;
}

const BREAK_POINT_MOBILE = 480;

function UserAgentProvider({ children }: UserAgentProviderProps) {
  const [userAgent, setUserAgent] = useState({ isMobile: false });
  const userAgentMemo = useMemo(() => userAgent, [userAgent]);

  const handleResizeWindow = useThrottleCallback(() => {
    setUserAgent({ isMobile: BREAK_POINT_MOBILE >= document.body.clientWidth });
  }, 1000);

  useEffect(function addWindowSizeObserve() {
    window.addEventListener('DOMContentLoaded', handleResizeWindow, { once: true });
    window.addEventListener('resize', handleResizeWindow);

    return () => {
      window.removeEventListener('resize', handleResizeWindow);
    };
  }, []);

  return <UserAgentContext.Provider value={userAgentMemo}>{children}</UserAgentContext.Provider>;
}

export default UserAgentProvider;
