import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5174,
    open: 'index.html'
  },
  build: {
    rollupOptions: {
      input: 'index.html'
    }
  }
});


