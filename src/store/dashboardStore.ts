import { create } from 'zustand'
import type { DashboardFilters } from '../config/types'

/**
 * Skeleton UI state only — not server payloads.
 * Server data belongs in TanStack Query (when you wire a real fetch).
 */
type DashboardState = {
  activeTab: string
  filters: DashboardFilters
  setActiveTab: (tab: string) => void
  setFilter: (id: string, value: string) => void
  resetFilters: () => void
  /** Call when role changes so tab/filters reset for the new config. */
  hydrateForRole: (defaultTab: string) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeTab: '',
  filters: {},
  setActiveTab: (tab) => set({ activeTab: tab }),
  setFilter: (id, value) =>
    set((state) => ({
      filters: { ...state.filters, [id]: value }
    })),
  resetFilters: () => set({ filters: {} }),
  hydrateForRole: (defaultTab) =>
    set({
      activeTab: defaultTab,
      filters: {}
    })
}))
