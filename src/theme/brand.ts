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
  surfaceLight: '#f8fafc',
  border: '#e4eaf2',
  muted: '#64748b',
  textMuted: '#667588',
  text: '#1f2937',
  headerText: '#495a75',
  hoverLight: '#f2f5fa',
  overlay: {
    white60: 'rgba(255, 255, 255, 0.6)',
    borderSoft: 'rgba(148, 163, 184, 0.08)',
    linkSoft: 'rgba(29, 160, 90, 0.06)'
  },
  shadow: {
    card: '0 8px 24px rgba(15, 23, 42, 0.04)',
    insetWhiteThin: 'inset 0 -1px 0 rgba(255, 255, 255, 0.2)',
    insetBorderSubtle: 'inset 0 0 0 1px rgba(148, 163, 184, 0.08)'
  },
  hoverBg: {
    linkLight: 'rgba(29, 160, 90, 0.06)'
  },
  chart: {
    marketToEmail: '#2f7cf6',
    smtp: '#ff5f57',
    push: '#22b07d'
  },
  status: {
    sent: { bg: '#e9f9ef', color: '#2a9d61' },
    queued: { bg: '#fff1d8', color: '#c98d00' },
    failed: { bg: '#fde7e7', color: '#d92d20' },
    acknowledged: { bg: '#e9f1ff', color: '#2b6fe8' }
  },
  metrics: {
    sent: '#2CBF73',
    queued: '#F3B63F',
    failed: '#EB4D3D',
    acknowledged: '#3B82F6'
  },
  gridStroke: '#e7ecf3',
  tick: '#7c8796',
  actionColors: {
    acknowledge: { bg: '#e9f1ff', color: '#2b6fe8' },
    resend: { bg: '#fff6f3', color: '#d97706' }
  }
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
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    button: { textTransform: 'none', fontWeight: 700 }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: brand.background
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: brand.link,
          textDecorationColor: brand.link,
          '&:hover': { color: brand.linkHover }
        }
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
        root: {
          backgroundImage: 'none'
        }
      }
    }
  }
})
