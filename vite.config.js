import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        pastEvents: resolve(__dirname, 'past-events.html'),
      },
    },
  },
});
