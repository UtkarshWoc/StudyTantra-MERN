import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Fallback to localhost:5000 for local development
  const baseURL = env.VITE_API_URL || 'http://localhost:5000';

  return {
    define: {
      'process.env.VITE_API_URL': JSON.stringify(baseURL)
    },
    plugins: [
      tailwindcss(),
      react(),
    ],
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js'],
      include: ['src/**/*.test.{js,jsx}'],
      css: false,
    },
  }
})
