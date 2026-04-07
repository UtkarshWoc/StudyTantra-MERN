import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Wire the PORT defined in .env exactly to where the frontend code expects the API URL
  const port = env.PORT || 5000;

  return {
    define: {
      // Expose the API URL reliably to the browser as process.env.REACT_APP_API_URL
      'process.env.REACT_APP_API_URL': JSON.stringify(`http://localhost:${port}`)
    },
    plugins: [
      tailwindcss(),
      react(),
    ],
  }
})
