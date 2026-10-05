import { create } from 'zustand'
import type {
  DashboardDataResponse,
  DashboardFilters,
  FilterDef
} from '../config/types'
import { parseRangeDefault } from '../utils/dateRange'

/**
 * Dashboard UI + fetch state.
 * Server payloads live here (not TanStack Query) — set by `useDashboard` /
 * `useDashboardData` via getDashboardData try/catch/finally.
 */
type DashboardState = {
  activeTab: string
  filters: DashboardFilters
  selectedIds: string[]

  isLoading: boolean
  dashboardData: DashboardDataResponse | null
  error: string | null

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

  setLoading: (isLoading: boolean) => void
  setDashboardData: (data: DashboardDataResponse | null) => void
  setError: (error: string | null) => void
}

/**
 * Derive store values from catalog `defaultValue` / pill defs.
 * Preset `defaultValue` sets the select key only — it does not write start/end
 * (Q_MANAGER Completed applies via Apply; O_MANAGER uses dateRangePill defaults).
 */
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

  return next
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeTab: 'unassigned',
  filters: {},
  selectedIds: [],
  isLoading: false,
  dashboardData: null,
  error: null,

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
      selectedIds: [],
      dashboardData: null,
      error: null
    }),

  setLoading: (isLoading) => set({ isLoading }),
  setDashboardData: (dashboardData) => set({ dashboardData }),
  setError: (error) => set({ error })
}))
