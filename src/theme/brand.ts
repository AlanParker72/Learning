import { createTheme } from '@mui/material/styles'

export const brand = {
  // Brand foundation colors used for the main application palette.
  primary: '#153415',
  primaryDark: '#102d10',
  primaryLight: '#e7efe7',

  // Core action and link colors used across multiple UI states.
  link: '#1da05a',
  linkHover: '#14804a',

  // Page layout and neutral surfaces.
  background: '#f4f6fb',
  surface: '#ffffff',
  surfaceLight: '#f8fafc',
  border: '#e4eaf2',
  muted: '#64748b',
  textMuted: '#667588',
  text: '#1f2937',
  headerText: '#495a75',
  hoverLight: '#f2f5fa',

  // Shared overlay and shadow tokens to keep rgba values centralized and editable.
  overlay: {
    white60: 'rgba(255, 255, 255, 0.6)',
    borderSoft: 'rgba(148, 163, 184, 0.08)',
    linkSoft: 'rgba(29, 160, 90, 0.06)'
  },
  shadow: {
    insetWhiteThin: 'inset 0 -1px 0 rgba(255, 255, 255, 0.2)',
    insetBorderSubtle: 'inset 0 0 0 1px rgba(148, 163, 184, 0.08)'
  },
  hoverBg: {
    linkLight: 'rgba(29, 160, 90, 0.06)'
  },

  // Chart colors for channel trend indicators.
  chart: {
    marketEmail: '#2f7cf6',
    smtpEmail: '#ff5f57',
    pushNotifications: '#22b07d'
  },

  // Delivery status state colors used in table chips and summary cards.
  status: {
    sent: { bg: '#e9f9ef', color: '#2a9d61' },
    queued: { bg: '#fff1d8', color: '#c98d00' },
    failed: { bg: '#fde7e7', color: '#d92d20' },
    acknowledged: { bg: '#e9f1ff', color: '#2b6fe8' }
  },

  // KPI and chart metric colors.
  metrics: {
    sent: '#2CBF73',
    queued: '#F3B63F',
    failed: '#EB4D3D',
    acknowledged: '#3B82F6'
  },

  // Reusable chart/neutral tokens.
  gridStroke: '#e7ecf3',
  tick: '#7c8796',

  // Action-specific comment colors, designed to be easy to tune later.
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
    }
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: brand.link,
          textDecorationColor: brand.link,
          '&:hover': {
            color: brand.linkHover
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: brand.primary,
          '&:hover': {
            backgroundColor: brand.primaryDark
          }
        }
      }
    }
  }
})
