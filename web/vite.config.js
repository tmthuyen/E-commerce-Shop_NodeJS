import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react({
      include: ['**/*.{js,jsx,ts,tsx}']
    })
  ], 
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),  // ← absolute path thay vì './src'
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  }
})