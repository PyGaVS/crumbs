import { defineConfig } from 'vite';
import { animations } from './plugins/animations.ts';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
  },
  plugins: [animations()],
  server: {
    port: 8080,
  },
});
