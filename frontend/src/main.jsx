import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.jsx'

// Automatically reload if a dynamic Vite chunk fails to fetch (e.g. after deployment or network drop)
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  window.location.reload();
});

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    sendDefaultPii: false,
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Don't hammer the API on client errors (404s, validation); retry transient ones once.
      retry: (failureCount, error) => failureCount < 1 && !(error?.response?.status >= 400 && error?.response?.status < 500),
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary
      fallback={({ error }) => (
        <div style={{ padding: 32, color: '#f1f5f9', fontFamily: 'monospace' }}>
          <p style={{ fontWeight: 'bold', fontSize: '18px', color: '#ef4444', marginBottom: '8px' }}>
            Something went wrong: {error?.message || 'Please reload the page.'}
          </p>
          {error?.stack && (
            <pre style={{ marginTop: '12px', background: '#18120c', border: '1px solid #c2652a', padding: '16px', borderRadius: '12px', overflowX: 'auto', fontSize: '12px', color: '#f5d0b5' }}>
              {error.stack}
            </pre>
          )}
        </div>
      )}
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
