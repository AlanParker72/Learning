import type { StyleProps } from 'react-json-view-lite/dist/DataRenderer'
import './payloadJsonViewer.css'

/** Custom react-json-view-lite style map — brand tokens, not library defaultStyles. */
export const payloadJsonStyles: StyleProps = {
  container: 'payload-json',
  basicChildStyle: 'payload-json-row',
  childFieldsContainer: 'payload-json-nested',
  label: 'payload-json-label',
  clickableLabel: 'payload-json-label-clickable',
  nullValue: 'payload-json-null',
  undefinedValue: 'payload-json-undefined',
  stringValue: 'payload-json-string',
  booleanValue: 'payload-json-boolean',
  numberValue: 'payload-json-number',
  otherValue: 'payload-json-other',
  punctuation: 'payload-json-punct',
  expandIcon: 'payload-json-expand',
  collapseIcon: 'payload-json-collapse',
  collapsedContent: 'payload-json-collapsed',
  noQuotesForStringValues: false,
  quotesForFieldNames: false,
  ariaLables: {
    collapseJson: 'Collapse JSON node',
    expandJson: 'Expand JSON node'
  },
  stringifyStringValues: false
}
