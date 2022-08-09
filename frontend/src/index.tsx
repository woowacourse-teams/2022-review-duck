import * as ReactDOM from 'react-dom/client';

import App from './App';

if (process.env.MOCKING) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { worker } = require('./mocks/browser');
  worker.start({
    serviceWorker: {
      url: `/mockServiceWorker.js`,
    },
  });
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(<App />);
