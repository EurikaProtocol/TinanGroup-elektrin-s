import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Relative base lets the same build work on GitHub Pages (project path or custom domain).
// GitHub Pages serves 404.html for unknown nested URLs (e.g. /a/b/c), where relative
// asset paths break; make only that page root-absolute.
const rootAbsolute404 = {
  name: 'root-absolute-404',
  transformIndexHtml: {
    order: 'post',
    handler(html, ctx) {
      return ctx.filename && ctx.filename.endsWith('404.html') ? html.replaceAll('"./', '"/') : html;
    },
  },
};

export default defineConfig({
  base: './',
  plugins: [rootAbsolute404],
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        inverteriai: resolve(import.meta.dirname, 'inverteriai.html'),
        kaupikliai: resolve(import.meta.dirname, 'kaupikliai.html'),
        moduliai: resolve(import.meta.dirname, 'moduliai.html'),
        konstrukcijos: resolve(import.meta.dirname, 'konstrukcijos.html'),
        'elektros-medziagos': resolve(import.meta.dirname, 'elektros-medziagos.html'),
        komplektai: resolve(import.meta.dirname, 'komplektai.html'),
        kainorastis: resolve(import.meta.dirname, 'kainorastis.html'),
        paslaugos: resolve(import.meta.dirname, 'paslaugos.html'),
        apie: resolve(import.meta.dirname, 'apie.html'),
        pasiulymas: resolve(import.meta.dirname, 'pasiulymas.html'),
        kontaktai: resolve(import.meta.dirname, 'kontaktai.html'),
        '404': resolve(import.meta.dirname, '404.html'),
      },
    },
  },
  test: { include: ['tests/**/*.test.js'] },
});
