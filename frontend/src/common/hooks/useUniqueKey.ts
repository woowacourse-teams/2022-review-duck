import { useRef } from 'react';

function useUniqueKey() {
  const keyRef = useRef(0);

  const getUniqueKey = () => {
    keyRef.current += 1;
    return keyRef.current;
  };

  return getUniqueKey;
}

export default useUniqueKey;
