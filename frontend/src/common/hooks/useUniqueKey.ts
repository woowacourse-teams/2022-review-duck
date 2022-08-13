import { useRef } from 'react';

function useUniqueKey(startKey?: number) {
  const keyRef = useRef(startKey || 0);

  const getUniqueKey = () => {
    keyRef.current += 1;
    return keyRef.current;
  };

  return getUniqueKey;
}

export default useUniqueKey;
