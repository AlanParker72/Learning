import { createTheme } from '@mui/material/styles'

/** Minimal theme for the RBAC skeleton shell. */
export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1e3a5f' },
    background: { default: '#f5f7fa', paper: '#ffffff' }
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif'
  }
})
