import { defineConfig } from 'vite';
export default defineConfig({
  base: '/the-forgotten-forest/',
  build: {
    rollupOptions: {
      output: { manualChunks: { three: ['three'] } },
    },
  },
});
