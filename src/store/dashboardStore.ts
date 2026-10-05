import { create } from 'zustand'
import type { DashboardFilters, FilterDef } from '../config/types'
import { parseRangeDefault, rangeForPreset } from '../utils/dateRange'

/**
 * Dashboard UI state only — not server payloads.
 * Server data lives in TanStack Query.
 */
type DashboardState = {
  activeTab: string
  filters: DashboardFilters
  selectedIds: string[]
  setActiveTab: (tab: string) => void
  setFilter: (id: string, value: string) => void
  setFilters: (filters: DashboardFilters) => void
  clearFilterKeys: (keys: string[]) => void
  resetFilters: () => void
  /** Build initial filter values from the active tab’s filter defs. */
  hydrateFiltersFromDefs: (defs: FilterDef[]) => void
  toggleSelected: (id: string) => void
  setSelectedIds: (ids: string[]) => void
  clearSelection: () => void
  /** Call when role changes so tab/filters reset for the new config. */
  hydrateForRole: (defaultTab: string, filterDefs?: FilterDef[]) => void
}

/** Derive store values from catalog `defaultValue` / pill / preset defs. */
export function initialFiltersFromDefs(defs: FilterDef[]): DashboardFilters {
  const next: DashboardFilters = {}

  for (const def of defs) {
    if (def.type === 'dateRangePill') {
      const keys = def.rangeKeys ?? { start: 'startDate', end: 'endDate' }
      const parsed = parseRangeDefault(def.defaultValue)
      if (parsed) {
        next[keys.start] = parsed.start
        next[keys.end] = parsed.end
      }
      continue
    }

    if (def.defaultValue != null && def.defaultValue !== '') {
      next[def.id] = def.defaultValue
    }
  }

  // If a preset default implies a concrete range and start/end are still empty, fill them.
  const preset = next.dateRangePreset
  if (preset && preset !== 'custom' && !next.startDate && !next.endDate) {
    const range = rangeForPreset(preset)
    if (range) {
      next.startDate = range.start
      next.endDate = range.end
    }
  }

  return next
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeTab: 'unassigned',
  filters: {},
  selectedIds: [],
  setActiveTab: (tab) => set({ activeTab: tab, selectedIds: [] }),
  setFilter: (id, value) =>
    set((state) => ({
      filters: { ...state.filters, [id]: value }
    })),
  setFilters: (filters) => set({ filters }),
  clearFilterKeys: (keys) =>
    set((state) => {
      const filters = { ...state.filters }
      for (const key of keys) delete filters[key]
      return { filters }
    }),
  resetFilters: () => set({ filters: {} }),
  hydrateFiltersFromDefs: (defs) =>
    set({ filters: initialFiltersFromDefs(defs) }),
  toggleSelected: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((x) => x !== id)
        : [...state.selectedIds, id]
    })),
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),
  hydrateForRole: (defaultTab, filterDefs = []) =>
    set({
      activeTab: defaultTab,
      filters: initialFiltersFromDefs(filterDefs),
      selectedIds: []
    })
}))
