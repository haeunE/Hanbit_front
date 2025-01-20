import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://openapi.naver.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/kakao': {
        target: 'https://dapi.kakao.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/kakao/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['jwt-decode'],
  },
});
