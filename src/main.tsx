import React from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import App from './App'
import { type AppConfig } from './config/appConfig'
import { UserRole } from './config/roles'
import { AppConfigProvider } from './context/AppConfigContext'
import { configureHttpClient } from './api/httpClient'
import { appTheme } from './theme/brand'

/**
 * Bootstrap parameters for the delivery dashboard.
 * Change `selectedRole` to `UserRole.READ_ONLY` to hide Acknowledge/Resend.
 * Set `apiBaseUrl` to override axios baseURL (env remains fallback when empty).
 */
const appConfig: AppConfig = {
  roles: [UserRole.ADMIN, UserRole.READ_ONLY],
  selectedRole: UserRole.ADMIN,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_BASE ?? ''
}

configureHttpClient(appConfig.apiBaseUrl)

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root was not found')
}

createRoot(rootElement).render(
  <React.StrictMode>
    <SnackbarProvider
      maxSnack={4}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      preventDuplicate
      autoHideDuration={3000}
      dense
    >
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <AppConfigProvider config={appConfig}>
          <App />
        </AppConfigProvider>
      </ThemeProvider>
    </SnackbarProvider>
  </React.StrictMode>
)
