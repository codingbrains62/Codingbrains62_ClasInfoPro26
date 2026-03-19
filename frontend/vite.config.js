import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    strictPort: true,
    proxy: {
      '/api/v1/': {
       target: process.env.VITE_PROXY_TARGET || 'http://localhost:1337',
       changeOrigin: true
      }
    }
  }
})
