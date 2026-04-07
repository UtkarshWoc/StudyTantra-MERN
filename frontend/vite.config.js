import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Safely fallback to localhost:5000 if the .env file is not picked up, completely fixing "undefined" port errors 
  const baseURL = env.REACT_APP_API_URL || 'http://localhost:5000';

  return {
    define: {
      'process.env.REACT_APP_API_URL': JSON.stringify(baseURL)
    },
    plugins: [
      tailwindcss(),
      react(),
    ],
  }
})
