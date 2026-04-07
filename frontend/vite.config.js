import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Safely fallback to localhost:5000, and enforce protocol prefix to prevent relative path mapping
  let baseURL = env.REACT_APP_API_URL || 'http://localhost:5000';
  if (baseURL && !/^https?:\/\//i.test(baseURL)) {
    baseURL = `https://${baseURL}`;
  }

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
