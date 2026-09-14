import React from 'react'
import { createRoot, type Root } from 'react-dom/client'
import App from '../App'
import { type AppConfig, DEFAULT_APP_CONFIG } from '../config/appConfig'
import { AppConfigProvider } from '../context/AppConfigContext'
import { configureHttpClient } from '../api/httpClient'
import { adoptCss } from './injectCss'
import { JSON_VIEWER_CSS } from './jsonViewerCss'
import { ShadowDomProviders } from './ShadowDomProviders'

export type MountDeliveryDashboardOptions = {
  /** Host element to mount into (custom element host or a div). */
  target: HTMLElement
  /** When true (default), attach an open shadow root and render inside it. */
  useShadowDom?: boolean
  /**
   * Light-DOM portal target that stacks above the host fixed header.
   * Strongly recommended — overlays inside shadow cannot paint above a
   * higher stacking context in the host (z-index alone will not fix that).
   */
  portalContainer?: HTMLElement | null
  /** Emotion insertion root; defaults to the shadow root (or document.head). */
  emotionContainer?: HTMLElement | ShadowRoot | null
  /** Overlay z-index floor when portals stay inside the WC. Default 14000. */
  overlayZIndex?: number
  config?: Partial<AppConfig>
}

export type DeliveryDashboardHandle = {
  unmount: () => void
  shadowRoot: ShadowRoot | null
  mountNode: HTMLElement
  portalContainer: HTMLElement
}

/**
 * Mount the dashboard for a host app / web component.
 * Prefer this over `main.tsx` when embedding.
 */
export function mountDeliveryDashboard(options: MountDeliveryDashboardOptions): DeliveryDashboardHandle {
  const {
    target,
    useShadowDom = true,
    portalContainer: portalFromHost = null,
    overlayZIndex = 14000,
    config: configOverrides
  } = options

  const config: AppConfig = { ...DEFAULT_APP_CONFIG, ...configOverrides }
  configureHttpClient(config.apiBaseUrl)

  let shadowRoot: ShadowRoot | null = null
  let mountParent: HTMLElement | ShadowRoot = target

  if (useShadowDom) {
    shadowRoot = target.shadowRoot ?? target.attachShadow({ mode: 'open' })
    mountParent = shadowRoot
    adoptCss(
      shadowRoot,
      `
        :host { display: block; width: 100%; }
        *, *::before, *::after { box-sizing: border-box; }
      `,
      'dd-host'
    )
    adoptCss(shadowRoot, JSON_VIEWER_CSS, 'dd-json-viewer')
  }

  const mountNode = document.createElement('div')
  mountNode.setAttribute('data-dd-root', 'true')
  mountParent.appendChild(mountNode)

  // Never pass ShadowRoot as MUI container — it has no .style and crashes scroll-lock.
  let portalContainer = portalFromHost
  if (!portalContainer) {
    portalContainer = document.createElement('div')
    portalContainer.setAttribute('data-dd-portal', 'true')
    portalContainer.style.position = 'relative'
    portalContainer.style.zIndex = String(overlayZIndex)
    mountParent.appendChild(portalContainer)
  }

  const emotionContainer = options.emotionContainer ?? shadowRoot ?? document.head

  const root: Root = createRoot(mountNode)
  root.render(
    <React.StrictMode>
      <ShadowDomProviders
        emotionContainer={emotionContainer}
        portalContainer={portalContainer}
        overlayZIndex={overlayZIndex}
        disableScrollLock
      >
        <AppConfigProvider config={config}>
          <App />
        </AppConfigProvider>
      </ShadowDomProviders>
    </React.StrictMode>
  )

  return {
    shadowRoot,
    mountNode,
    portalContainer,
    unmount: () => {
      root.unmount()
      mountNode.remove()
      if (!portalFromHost) portalContainer?.remove()
    }
  }
}
