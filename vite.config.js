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
      '/load': {
        target: 'https://naveropenapi.apigw.ntruss.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/load/, ''),
      },
      '/kakao': {
        target: 'https://dapi.kakao.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/kakao/, ''),
      },
      "/danger-api": {
        target: "https://www.safe182.go.kr",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/danger-api/, ""),
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
