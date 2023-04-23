import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';
import linaria from '@linaria/vite';
import path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr({
      exportAsDefault: true,
    }),
    linaria({
      include: ['**/*.{ts,tsx}'],
      babelOptions: {
        presets: ['@babel/preset-typescript', '@babel/preset-react'],
      },
    }),
  ],
  server: {
    port: 3000,
  },
  envPrefix: 'CLIENT',
  envDir: 'env',
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      scss: {
        includePaths: [path.resolve(__dirname, 'src')],
      },
    },
  },
});
