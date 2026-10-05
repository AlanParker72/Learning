import { create } from 'zustand'
import type { DashboardFilters } from '../config/types'

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
  resetFilters: () => void
  toggleSelected: (id: string) => void
  setSelectedIds: (ids: string[]) => void
  clearSelection: () => void
  /** Call when role changes so tab/filters reset for the new config. */
  hydrateForRole: (defaultTab: string) => void
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
  resetFilters: () => set({ filters: {} }),
  toggleSelected: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((x) => x !== id)
        : [...state.selectedIds, id]
    })),
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),
  hydrateForRole: (defaultTab) =>
    set({
      activeTab: defaultTab,
      filters: {},
      selectedIds: []
    })
}))
