import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        pastEvents: resolve(__dirname, 'past-events.html'),
        games: resolve(__dirname, 'games.html'),
      },
    },
  },
});
