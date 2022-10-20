import { useEffect, useState } from 'react';

function usePageTitle(initialTitle: string | null, appName: string) {
  const [pageTitle, setTitle] = useState('');
  const currentTitle = pageTitle || initialTitle;

  useEffect(() => {
    document.title = currentTitle ? `${currentTitle} - ${appName}` : appName;

    return () => {
      document.title = appName;
    };
  }, [currentTitle]);

  const setPageTitle = (title: string | undefined) => {
    setTitle(title || appName);
  };

  return Object.assign(currentTitle || appName, { set: setPageTitle });
}

export default usePageTitle;
