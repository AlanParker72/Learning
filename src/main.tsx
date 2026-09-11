import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { appTheme } from './theme/brand'
import { SnackbarProvider } from 'notistack'
import ApiSetup from './api/apiSetup'

const root = createRoot(document.getElementById('root')!)

root.render(
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
        {/* ApiSetup registers global interceptors and error -> toast mapping */}
        <ApiSetup />
        <App />
      </ThemeProvider>
    </SnackbarProvider>
  </React.StrictMode>
)
