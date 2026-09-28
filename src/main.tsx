import React from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'
import App from './App'
import { appTheme } from './theme/brand'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root was not found')
}

createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        maxSnack={4}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        preventDuplicate
        autoHideDuration={3000}
        dense
      >
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
