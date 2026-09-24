import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: path.resolve(__dirname, 'postcss.config.js'),
  },
  resolve: {
    alias: {
      '@ethio-buna/shared': path.resolve(
        __dirname,
        '../../packages/shared/index.js',
      ),
      '/packages/shared': path.resolve(__dirname, '../../packages/shared'),
    },
  },
  server: {
    port: 3001,
    fs: {
      allow: ['..', '../../packages/shared', '../../node_modules'],
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router-dom')
            ) {
              return 'vendor';
            }
            if (id.includes('lucide-react') || id.includes('framer-motion')) {
              return 'ui';
            }
          }
        },
      },
    },
  },
  root: path.resolve(__dirname),
});
