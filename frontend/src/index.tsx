import * as ReactDOM from 'react-dom/client';

import App from './App';

if (process.env.MOCKING) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { worker } = __MSW_DIR__ ? require(__MSW_DIR__) : '';

  worker.start({
    serviceWorker: {
      url: `/mockServiceWorker.js`,
    },
  });
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(<App />);
