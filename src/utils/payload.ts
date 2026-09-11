export type PayloadField = {
  key: string
  value: string
}

export type PayloadSection = {
  title: string
  fields: PayloadField[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '—'
  if (Array.isArray(value)) return value.map((item) => formatValue(item)).join(', ')
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const flattenFields = (record: Record<string, unknown>, prefix = ''): PayloadField[] => {
  const fields: PayloadField[] = []

  Object.entries(record).forEach(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (isRecord(value)) {
      fields.push(...flattenFields(value, path))
      return
    }
    fields.push({ key: path, value: formatValue(value) })
  })

  return fields
}

export const humanizeKey = (key: string): string => {
  const leaf = key.split('.').pop() ?? key
  return leaf
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export const toPayloadSections = (payload: Record<string, unknown>): PayloadSection[] => {
  const nestedSections = Object.entries(payload)
    .filter(([, value]) => isRecord(value))
    .map(([key, value]) => ({
      title: key,
      fields: flattenFields(value as Record<string, unknown>)
    }))

  const rootFields = Object.entries(payload)
    .filter(([, value]) => !isRecord(value))
    .map(([key, value]) => ({ key, value: formatValue(value) }))

  const sections: PayloadSection[] = []
  if (rootFields.length > 0) {
    sections.push({ title: 'Overview', fields: rootFields })
  }

  return [...sections, ...nestedSections]
}
