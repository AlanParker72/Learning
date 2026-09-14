import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider, createTheme, type Theme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { SnackbarProvider } from 'notistack'
import { useMemo, type ReactNode } from 'react'
import { appTheme, brand } from '../theme/brand'
import { PortalContainerProvider, usePortalContainer } from './PortalContainerContext'

export type ShadowDomProvidersProps = {
  /** Emotion style insertion point (ShadowRoot or a <head>-like element). */
  emotionContainer?: HTMLElement | ShadowRoot | null
  /**
   * Portal mount for overlays. Prefer light-DOM above the host fixed header.
   * Must be an Element (not ShadowRoot).
   */
  portalContainer?: Element | null
  /** Raise overlay z-index above a host fixed header when portaling inside the WC. */
  overlayZIndex?: number
  /** Skip document.body scroll lock (required when body/container is wrong under WC). */
  disableScrollLock?: boolean
  children: ReactNode
}

function buildEmbedTheme(
  base: Theme,
  options: {
    getPortal: () => Element | null | undefined
    overlayZIndex: number
    disableScrollLock: boolean
  }
): Theme {
  const { getPortal, overlayZIndex, disableScrollLock } = options
  const containerProp = () => getPortal() ?? undefined

  return createTheme(base, {
    zIndex: {
      mobileStepper: overlayZIndex - 400,
      fab: overlayZIndex - 350,
      speedDial: overlayZIndex - 350,
      appBar: overlayZIndex - 300,
      drawer: overlayZIndex - 100,
      modal: overlayZIndex,
      snackbar: overlayZIndex + 50,
      tooltip: overlayZIndex + 100
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          // Avoid forcing host <body> background when embedded.
          body: {
            backgroundColor: 'transparent'
          }
        }
      },
      MuiModal: {
        defaultProps: {
          container: containerProp,
          disableScrollLock
        }
      },
      MuiDrawer: {
        defaultProps: {
          container: containerProp,
          disableScrollLock,
          ModalProps: { disableScrollLock, container: containerProp }
        }
      },
      MuiDialog: {
        defaultProps: {
          container: containerProp,
          disableScrollLock
        }
      },
      MuiMenu: {
        defaultProps: {
          container: containerProp,
          disableScrollLock
        }
      },
      MuiPopover: {
        defaultProps: {
          container: containerProp,
          disableScrollLock
        }
      },
      MuiPopper: {
        defaultProps: {
          container: containerProp
        }
      },
      MuiTooltip: {
        defaultProps: {
          PopperProps: {
            container: containerProp
          }
        }
      },
      MuiPortal: {
        defaultProps: {
          container: containerProp
        }
      }
    }
  })
}

/**
 * Emotion + MUI providers for document or Shadow DOM mounts.
 * Standalone `main.tsx` can keep ThemeProvider; WC hosts should wrap with this.
 */
export function ShadowDomProviders({
  emotionContainer = null,
  portalContainer = null,
  overlayZIndex = 14000,
  disableScrollLock = true,
  children
}: ShadowDomProvidersProps) {
  const cache = useMemo(() => {
    if (!emotionContainer) {
      return createCache({ key: 'dd', prepend: true })
    }
    return createCache({
      key: 'dd',
      prepend: true,
      // Emotion accepts ShadowRoot as style container at runtime.
      container: emotionContainer as unknown as HTMLElement
    })
  }, [emotionContainer])

  return (
    <CacheProvider value={cache}>
      <PortalContainerProvider container={portalContainer}>
        <EmbedThemeBridge overlayZIndex={overlayZIndex} disableScrollLock={disableScrollLock}>
          {children}
        </EmbedThemeBridge>
      </PortalContainerProvider>
    </CacheProvider>
  )
}

function EmbedThemeBridge({
  overlayZIndex,
  disableScrollLock,
  children
}: {
  overlayZIndex: number
  disableScrollLock: boolean
  children: ReactNode
}) {
  const portal = usePortalContainer()
  const theme = useMemo(
    () =>
      buildEmbedTheme(appTheme, {
        getPortal: () => portal,
        overlayZIndex,
        disableScrollLock
      }),
    [portal, overlayZIndex, disableScrollLock]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={4}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        preventDuplicate
        autoHideDuration={3000}
        dense
        classes={{ containerRoot: 'dd-snackbar-root' }}
      >
        <style>{`.dd-snackbar-root{z-index:${overlayZIndex + 50}!important}`}</style>
        {children}
      </SnackbarProvider>
    </ThemeProvider>
  )
}

/** Re-export brand for hosts that need tokens when styling the CE shell. */
export { brand }
