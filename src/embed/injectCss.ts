/**
 * Inject CSS into a ShadowRoot or Element.
 * Vite global CSS imports land on document.head and do not pierce shadow DOM —
 * call this for library CSS (e.g. react-json-view-lite) when mounting in a WC.
 */
export function injectCss(target: ShadowRoot | Element, cssText: string, attrName = 'data-dd-css'): HTMLStyleElement {
  const existing = target.querySelector<HTMLStyleElement>(`style[${attrName}]`)
  if (existing) {
    existing.textContent = cssText
    return existing
  }

  const style = document.createElement('style')
  style.setAttribute(attrName, 'true')
  style.textContent = cssText
  target.appendChild(style)
  return style
}

/** Prefer constructable stylesheets when available; fall back to a <style> tag. */
export function adoptCss(shadowRoot: ShadowRoot, cssText: string, sheetKey = 'dd-css'): void {
  if ('adoptedStyleSheets' in shadowRoot && typeof CSSStyleSheet !== 'undefined') {
    try {
      const sheet = new CSSStyleSheet()
      sheet.replaceSync(cssText)
      const keyed = sheet as CSSStyleSheet & { __ddKey?: string }
      keyed.__ddKey = sheetKey
      const others = shadowRoot.adoptedStyleSheets.filter(
        (existing) => (existing as CSSStyleSheet & { __ddKey?: string }).__ddKey !== sheetKey
      )
      shadowRoot.adoptedStyleSheets = [...others, sheet]
      return
    } catch {
      // Fall through for browsers that lack replaceSync or block constructable sheets.
    }
  }
  injectCss(shadowRoot, cssText, `data-${sheetKey}`)
}
