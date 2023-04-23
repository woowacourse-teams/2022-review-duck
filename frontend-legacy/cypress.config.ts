import { defineConfig } from 'cypress';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackConfig = require('./.webpack/webpack.dev')(null, { options: { mode: 'development' } });

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.specPattern = './src/tests/*.spec.ts';
      config.viewportWidth = 1380;
      config.viewportHeight = 1080;
      config.baseUrl = `http://localhost:${webpackConfig.devServer.port}`;
      config.video = false;

      return config;
    },
  },
});
