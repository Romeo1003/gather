import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { ThemeProvider } from './context/ThemeContext.jsx'
import { ServicesProvider } from './context/ServicesContext.jsx'
import { createApiClient } from './services/apiClient'

const apiClient = createApiClient({
  baseURL: 'http://localhost:5001/api',
  errorHandler: (error) => console.error('API Error:', error),
  authProvider: { getToken: () => localStorage.getItem('token') }
})

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found')
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <ServicesProvider services={{
        apiClient: apiClient,
        authService: {
          login: (credentials) => apiClient.post('/auth/login', credentials)
        }
      }}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ServicesProvider>
    </StrictMode>
  )
}
