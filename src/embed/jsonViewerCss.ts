import jsonLiteCss from 'react-json-view-lite/dist/index.css?inline'
import payloadCss from '../components/deliveries/payloadJsonViewer.css?inline'

/** Combined JSON viewer CSS for Shadow DOM injection (document.head imports do not apply inside shadow). */
export const JSON_VIEWER_CSS = `${jsonLiteCss}\n${payloadCss}`
