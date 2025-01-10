import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api'로 시작하는 요청을 네이버 API로 프록시합니다.
      '/api': {
        target: 'https://openapi.naver.com',  // 네이버 API의 URL
        changeOrigin: true,  // CORS 헤더를 수정하여 요청을 전달
        rewrite: (path) => path.replace(/^\/api/, '') // /api 경로를 제거하고 API로 전달
      },
    }
  },
  
})
