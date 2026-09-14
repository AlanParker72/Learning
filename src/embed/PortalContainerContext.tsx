import { createContext, useContext, type ReactNode } from 'react'

/**
 * Mount node for MUI Modal / Drawer / Dialog / Menu / Popper portals.
 *
 * - Prefer a **light-DOM** element that sits above the host fixed header
 *   (escapes the shadow stacking context).
 * - If only a shadow mount is available, use an Element *inside* the shadow
 *   (never the ShadowRoot itself — MUI scroll-lock crashes on `.style.overflow`).
 */
const PortalContainerContext = createContext<Element | null>(null)

export function PortalContainerProvider({
  container,
  children
}: {
  container: Element | null
  children: ReactNode
}) {
  return (
    <PortalContainerContext.Provider value={container}>
      {children}
    </PortalContainerContext.Provider>
  )
}

export function usePortalContainer(): Element | null {
  return useContext(PortalContainerContext)
}
