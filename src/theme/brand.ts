import { createTheme } from '@mui/material/styles'

/** Delivery-list status colors — soft pastels; single source for chips, filters, and charts. */
const deliveryStatus = {
  NEW: {
    color: '#6b6fb8',
    background: '#f0f1fb',
    border: '#d4d6ef'
  },
  DISPATCHED: {
    color: '#4d8f87',
    background: '#eef6f5',
    border: '#c5ddd9'
  },
  ERROR_STOP: {
    color: '#b85f5f',
    background: '#faf2f2',
    border: '#e8cfcf'
  },
  ERROR_RETRY: {
    color: '#b8744a',
    background: '#faf4ef',
    border: '#e8d4c4'
  },
  PROCESSING: {
    color: '#5a7eb8',
    background: '#eef3fa',
    border: '#c8d6e8'
  },
  QUEUED: {
    color: '#a8893a',
    background: '#faf6ed',
    border: '#e8dcc0'
  },
  FAILED_RETRY: {
    color: '#c06a62',
    background: '#faf1f0',
    border: '#e8cfcc'
  },
  ACKNOWLEDGED: {
    color: '#5a84b8',
    background: '#eef3fa',
    border: '#c5d5e8'
  },
  COMPLETE: {
    color: '#4d8f6a',
    background: '#eef6f1',
    border: '#c5ddd0'
  }
} as const

const chart = {
  marketToEmail: '#6b93c9',
  smtp: '#d48984',
  push: '#5a9e7d',
  marketToEmailBg: '#eef3fa',
  smtpBg: '#faf1f0',
  pushBg: '#eef6f1'
} as const

export const brand = {
  primary: '#1a3a1a',
  primaryDark: '#142e14',
  primaryLight: '#e8f0e8',
  tableHeader: '#2a4058',
  link: '#459968',
  linkHover: '#378056',
  background: '#f5f7fb',
  surface: '#ffffff',
  surfaceLight: '#f8fafc',
  border: '#e6ebf2',
  muted: '#6b7a8d',
  textMuted: '#6a7889',
  text: '#2a3441',
  headerText: '#5a6b82',
  hoverLight: '#f3f5f9',
  overlay: {
    white60: 'rgba(255, 255, 255, 0.6)',
    borderSoft: 'rgba(148, 163, 184, 0.08)',
    linkSoft: 'rgba(69, 153, 104, 0.08)'
  },
  shadow: {
    card: '0 8px 24px rgba(15, 23, 42, 0.04)',
    insetWhiteThin: 'inset 0 -1px 0 rgba(255, 255, 255, 0.2)',
    insetBorderSubtle: 'inset 0 0 0 1px rgba(148, 163, 184, 0.08)'
  },
  hoverBg: {
    linkLight: 'rgba(69, 153, 104, 0.08)'
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
  gridStroke: '#e8edf4',
  tick: '#85919f',
  actionColors: {
    acknowledge: {
      bg: deliveryStatus.ACKNOWLEDGED.background,
      color: deliveryStatus.ACKNOWLEDGED.color
    },
    resend: { bg: '#faf5f0', color: '#c4904a' },
    retry: { bg: '#faf5f0', color: '#c4904a' }
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
