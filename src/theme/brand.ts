import { createTheme } from '@mui/material/styles'

export const brand = {
  primary: '#153415',
  primaryDark: '#102d10',
  primaryLight: '#e7efe7',
  tableHeader: '#17324f',
  link: '#1da05a',
  linkHover: '#14804a',
  background: '#f4f6fb',
  surface: '#ffffff',
  textMuted: '#667588',
  text: '#1f2937'
} as const

export const appTheme = createTheme({
  palette: {
    primary: {
      main: brand.primary,
      dark: brand.primaryDark,
      light: brand.primaryLight
    },
    success: {
      main: brand.link,
      dark: brand.linkHover,
      light: brand.primaryLight
    },
    background: {
      default: brand.background,
      paper: brand.surface
    },
    text: {
      primary: brand.text,
      secondary: brand.textMuted
    }
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
    button: { textTransform: 'none', fontWeight: 700 }
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: brand.background }
      }
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: brand.primary,
          '&:hover': { backgroundColor: brand.primaryDark }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' }
      }
    }
  }
})
