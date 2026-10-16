import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Relative base lets the same build work on GitHub Pages (project path or custom domain).
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        inverteriai: resolve(__dirname, 'inverteriai.html'),
        kaupikliai: resolve(__dirname, 'kaupikliai.html'),
        kontaktai: resolve(__dirname, 'kontaktai.html'),
        '404': resolve(__dirname, '404.html'),
      },
    },
  },
  test: { include: ['tests/**/*.test.js'] },
});
