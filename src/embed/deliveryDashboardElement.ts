import { mountDeliveryDashboard, type MountDeliveryDashboardOptions } from './mountDashboard'
import { UserRole } from '../config/roles'

const ELEMENT_NAME = 'delivery-dashboard'

/**
 * Optional custom element wrapper for host apps.
 *
 * Attributes:
 * - api-base-url
 * - role (ADMIN | READ_ONLY)
 * - overlay-z-index
 *
 * Host fixed-header overlap: set property `portalContainer` to a light-DOM
 * node that stacks above the host header before connecting, or place
 * `<div id="dd-overlay-root">` as a direct child of <body> with a high z-index.
 */
class DeliveryDashboardElement extends HTMLElement {
  #handle: ReturnType<typeof mountDeliveryDashboard> | null = null
  /** Optional light-DOM portal override set by the host before/after connect. */
  portalContainer: HTMLElement | null = null

  static get observedAttributes() {
    return ['api-base-url', 'role', 'overlay-z-index']
  }

  connectedCallback() {
    this.#mount()
  }

  disconnectedCallback() {
    this.#handle?.unmount()
    this.#handle = null
  }

  attributeChangedCallback() {
    if (!this.isConnected) return
    this.#handle?.unmount()
    this.#mount()
  }

  #mount() {
    const roleAttr = (this.getAttribute('role') ?? 'ADMIN').toUpperCase()
    const selectedRole = roleAttr === 'READ_ONLY' ? UserRole.READ_ONLY : UserRole.ADMIN
    const overlayZIndex = Number(this.getAttribute('overlay-z-index') ?? '14000')
    const hostPortal =
      this.portalContainer ??
      (document.getElementById('dd-overlay-root') as HTMLElement | null)

    const options: MountDeliveryDashboardOptions = {
      target: this,
      useShadowDom: true,
      portalContainer: hostPortal,
      overlayZIndex: Number.isFinite(overlayZIndex) ? overlayZIndex : 14000,
      config: {
        selectedRole,
        apiBaseUrl: this.getAttribute('api-base-url') ?? ''
      }
    }

    this.#handle = mountDeliveryDashboard(options)
  }
}

export function defineDeliveryDashboardElement(tagName = ELEMENT_NAME): void {
  if (typeof window === 'undefined' || !window.customElements) return
  if (!customElements.get(tagName)) {
    customElements.define(tagName, DeliveryDashboardElement)
  }
}

// Auto-register when this module is loaded as a bundle entry.
defineDeliveryDashboardElement()

export { DeliveryDashboardElement }
