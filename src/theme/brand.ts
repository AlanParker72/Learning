import { createTheme } from '@mui/material/styles'

/** Delivery-list status colors — single source for chips, filters, and charts. */
const deliveryStatus = {
  NEW: {
    color: '#4f46e5',
    background: '#eef0ff',
    border: '#c7cbf9'
  },
  DISPATCHED: {
    color: '#0d9488',
    background: '#e6f7f5',
    border: '#99d8d0'
  },
  ERROR_STOP: {
    color: '#b91c1c',
    background: '#fee2e2',
    border: '#fca5a5'
  },
  ERROR_RETRY: {
    color: '#c2410c',
    background: '#ffedd5',
    border: '#fdba74'
  },
  PROCESSING: {
    color: '#2563eb',
    background: '#dbeafe',
    border: '#93c5fd'
  },
  QUEUED: {
    color: '#c98d00',
    background: '#fff1d8',
    border: '#f7d38b'
  },
  FAILED_RETRY: {
    color: '#d92d20',
    background: '#fde7e7',
    border: '#f6b5b5'
  },
  ACKNOWLEDGED: {
    color: '#2b6fe8',
    background: '#e9f1ff',
    border: '#afcbff'
  },
  COMPLETE: {
    color: '#2a9d61',
    background: '#e9f9ef',
    border: '#a7e7c1'
  }
} as const

const chart = {
  marketToEmail: '#2f7cf6',
  smtp: '#ff5f57',
  push: '#22b07d',
  marketToEmailBg: '#eaf2ff',
  smtpBg: '#ffe9e7',
  pushBg: '#e8f9f1'
} as const

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
  chart,
  /** Full delivery-list enum palette (color / background / border). */
  deliveryStatus,
  /** Aggregate dashboard KPI status (maps onto deliveryStatus tokens). */
  status: {
    sent: { bg: deliveryStatus.COMPLETE.background, color: deliveryStatus.COMPLETE.color },
    queued: { bg: deliveryStatus.QUEUED.background, color: deliveryStatus.QUEUED.color },
    failed: { bg: deliveryStatus.FAILED_RETRY.background, color: deliveryStatus.FAILED_RETRY.color },
    acknowledged: { bg: deliveryStatus.ACKNOWLEDGED.background, color: deliveryStatus.ACKNOWLEDGED.color }
  },
  metrics: {
    sent: deliveryStatus.COMPLETE.color,
    queued: deliveryStatus.QUEUED.color,
    failed: deliveryStatus.FAILED_RETRY.color,
    acknowledged: deliveryStatus.ACKNOWLEDGED.color
  },
  gridStroke: '#e7ecf3',
  tick: '#7c8796',
  actionColors: {
    acknowledge: {
      bg: deliveryStatus.ACKNOWLEDGED.background,
      color: deliveryStatus.ACKNOWLEDGED.color
    },
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
