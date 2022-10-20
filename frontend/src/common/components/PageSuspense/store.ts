import { createContext } from 'react';

import { atom } from 'recoil';

interface FallbackContextType {
  fallbackChildrenRef: React.MutableRefObject<React.ReactNode>;
  setFallback: (children: React.ReactNode) => void;
}

export const SuspenseContext = createContext<FallbackContextType | null>(null);

// 사용처에서 리렌더링을 방지하기 위해 Recoil을 활용하였음.
export const pageLoadedAtom = atom({
  key: 'page-loaded',
  default: false,
});
