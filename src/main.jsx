import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n' // Initializes i18next + sets document direction
import { initAnalytics } from './lib/analytics'
import { initErrorTracking, ErrorBoundary } from './lib/errorTracking'

// Initialize observability infrastructure
// Both are no-ops if VITE_POSTHOG_KEY / VITE_SENTRY_DSN aren't set
initErrorTracking()
initAnalytics()

// Fallback UI shown if a React error bubbles to the root
function ErrorFallback() {
  return (
    <div dir="rtl" style={{
      minHeight: '100vh',
      backgroundColor: '#FAF6EF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Heebo, system-ui, sans-serif',
      color: '#1A2B4A'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📚</div>
        <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '12px' }}>
          משהו השתבש
        </h1>
        <p style={{ color: '#4A5568', marginBottom: '24px' }}>
          נתקלנו בבעיה. נסה לרענן את הדף. אם הבעיה חוזרת — כתוב לנו ב-hello@readright.app
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 28px',
            borderRadius: '999px',
            backgroundColor: '#1A2B4A',
            color: '#F5A524',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          רענן את הדף
        </button>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<ErrorFallback />}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
