import { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  filterByPermission,
  getDashboardConfig,
  resolveActionsForTab,
  resolveFiltersForTab
} from '../config/dashboardConfig'
import type { ActionDef, TabDef } from '../config/types'
import {
  Form,
  Fields as FieldsRenderer,
  resolveFormConfigForTab,
  useFormConfig
} from '../form'
import type { FormConfig, FormHandle } from '../form'
import { ROLE_PERMISSIONS } from '../rbac/rolePermissions'
import { usePermission } from '../rbac/usePermission'
import {
  getDashboardData,
  type GetDashboardDataParams
} from '../services/dashboardApi'
import { useAuthStore } from '../store/authStore'
import { useDashboardStore } from '../store/dashboardStore'

export type UseDashboardResult = {
  /** DSP-style form handle from stub `useFormConfig`. */
  form: FormHandle
  /** Field configs for the active tab (RBAC-filtered). */
  fields: FormConfig['fields']
  /** Optional Form wrapper stub. */
  Form: typeof Form
  /**
   * Bound Fields renderer for the active form config + filter-bar actions.
   * Pass `onAction` for Clear All / other filter-bar toasts.
   */
  Fields: (props?: { onAction?: (actionId: string) => void }) => JSX.Element | null
  onReset: () => void
  isLoading: boolean
  dashboardData: ReturnType<typeof useDashboardStore.getState>['dashboardData']
  error: string | null
  /** Fetch (or refetch) dashboard rows into the Zustand store. */
  fetchDashboard: (params?: Partial<GetDashboardDataParams>) => Promise<void>
  refetch: () => Promise<void>
  activeTab: string
  setActiveTab: (tab: string) => void
  filters: Record<string, string>
  visibleTabs: TabDef[]
  activeTabDef: TabDef | undefined
  visibleActions: ActionDef[]
  filterBarActions: ActionDef[]
  tableActions: ActionDef[]
  config: ReturnType<typeof getDashboardConfig>
  selectedIds: string[]
  toggleSelected: (id: string) => void
  setSelectedIds: (ids: string[]) => void
  clearSelection: () => void
}

/**
 * Dashboard data + form hook (no React Query).
 *
 * Pattern:
 * - Zustand store holds `isLoading` / `dashboardData` / `error` + filter UI state
 * - `fetchDashboard` → `getDashboardData` with async/await try/catch/finally
 * - Filters UI from JSON form config via stub `useFormConfig` + `<Fields />`
 * - RBAC: `filterPermissions ∩ role` selects which form field keys appear
 */
export function useDashboard(): UseDashboardResult {
  const activeRole = useAuthStore((s) => s.activeRole)
  const { can } = usePermission()
  const rolePermissions = ROLE_PERMISSIONS[activeRole]

  const activeTab = useDashboardStore((s) => s.activeTab)
  const filters = useDashboardStore((s) => s.filters)
  const selectedIds = useDashboardStore((s) => s.selectedIds)
  const isLoading = useDashboardStore((s) => s.isLoading)
  const dashboardData = useDashboardStore((s) => s.dashboardData)
  const error = useDashboardStore((s) => s.error)

  const setActiveTab = useDashboardStore((s) => s.setActiveTab)
  const setFilters = useDashboardStore((s) => s.setFilters)
  const resetFilters = useDashboardStore((s) => s.resetFilters)
  const hydrateFiltersFromDefs = useDashboardStore(
    (s) => s.hydrateFiltersFromDefs
  )
  const toggleSelected = useDashboardStore((s) => s.toggleSelected)
  const setSelectedIds = useDashboardStore((s) => s.setSelectedIds)
  const clearSelection = useDashboardStore((s) => s.clearSelection)
  const hydrateForRole = useDashboardStore((s) => s.hydrateForRole)
  const setLoading = useDashboardStore((s) => s.setLoading)
  const setDashboardData = useDashboardStore((s) => s.setDashboardData)
  const setError = useDashboardStore((s) => s.setError)

  const prevTabRef = useRef<string | null>(null)
  const fetchGenRef = useRef(0)

  const config = getDashboardConfig(activeRole)
  const visibleTabs = filterByPermission(config.tabs, can)

  // Reset tab/filters when role changes (authStore / env — no UI switcher)
  useEffect(() => {
    const cfg = getDashboardConfig(activeRole)
    const perms = ROLE_PERMISSIONS[activeRole]
    const defaultTabDef =
      cfg.tabs.find((t) => t.id === cfg.defaultTab) ?? cfg.tabs[0]
    const defs = defaultTabDef
      ? resolveFiltersForTab(perms, defaultTabDef)
      : []
    hydrateForRole(cfg.defaultTab, defs)
    prevTabRef.current = cfg.defaultTab
  }, [activeRole, hydrateForRole])

  useEffect(() => {
    if (visibleTabs.length === 0) return
    if (!visibleTabs.some((t) => t.id === activeTab)) {
      setActiveTab(config.defaultTab)
    }
  }, [visibleTabs, activeTab, config.defaultTab, setActiveTab])

  const activeTabDef =
    visibleTabs.find((t) => t.id === activeTab) ?? visibleTabs[0]
  const queryTab = activeTabDef?.id ?? config.defaultTab

  useEffect(() => {
    if (!activeTabDef) return
    if (prevTabRef.current === activeTabDef.id) return
    prevTabRef.current = activeTabDef.id
    hydrateFiltersFromDefs(
      resolveFiltersForTab(ROLE_PERMISSIONS[activeRole], activeTabDef)
    )
  }, [activeRole, activeTabDef, hydrateFiltersFromDefs])

  const formConfig = useMemo(
    () =>
      activeTabDef
        ? resolveFormConfigForTab(
            rolePermissions,
            activeTabDef.filterPermissions ?? []
          )
        : { fields: {} },
    [activeTabDef, rolePermissions]
  )

  const { form, fields } = useFormConfig(formConfig, {
    mode: 'onChange',
    defaultValues: filters,
    onValuesChange: setFilters
  })

  const visibleActions = useMemo(
    () =>
      activeTabDef
        ? resolveActionsForTab(
            rolePermissions,
            activeTabDef,
            config.actionPermissions ?? []
          )
        : [],
    [activeTabDef, config.actionPermissions, rolePermissions]
  )

  const filterBarActions = visibleActions.filter(
    (a) => a.placement === 'filterBar'
  )
  const tableActions = visibleActions.filter(
    (a) => a.placement === 'row' || a.placement === 'bulk'
  )

  const fetchDashboard = useCallback(
    async (params?: Partial<GetDashboardDataParams>) => {
      const gen = ++fetchGenRef.current
      const role = params?.role ?? activeRole
      const tab = params?.tab ?? queryTab
      const nextFilters = params?.filters ?? useDashboardStore.getState().filters

      setLoading(true)
      setError(null)
      try {
        const data = await getDashboardData({
          role,
          tab,
          filters: nextFilters,
          page: params?.page,
          size: params?.size
        })
        if (gen !== fetchGenRef.current) return
        setDashboardData(data)
      } catch (err) {
        if (gen !== fetchGenRef.current) return
        const message =
          err instanceof Error ? err.message : 'Failed to load dashboard data'
        setError(message)
        setDashboardData(null)
      } finally {
        if (gen === fetchGenRef.current) {
          setLoading(false)
        }
      }
    },
    [activeRole, queryTab, setDashboardData, setError, setLoading]
  )

  const refetch = useCallback(() => fetchDashboard(), [fetchDashboard])

  // Fetch when role | tab | filters change (replaces TanStack Query).
  useEffect(() => {
    if (!activeRole || !queryTab) return
    void fetchDashboard()
  }, [activeRole, queryTab, filters, fetchDashboard])

  /** Clear All — empty filter values (tab hydrate still applies catalog defaults). */
  const onReset = useCallback(() => {
    form.reset({})
    resetFilters()
  }, [form, resetFilters])

  const Fields = useCallback(
    (props?: { onAction?: (actionId: string) => void }) => (
      <FieldsRenderer
        fields={fields}
        form={form}
        actions={filterBarActions}
        onReset={onReset}
        onAction={props?.onAction}
      />
    ),
    [fields, form, filterBarActions, onReset]
  )

  return {
    form,
    fields,
    Form,
    Fields,
    onReset,
    isLoading,
    dashboardData,
    error,
    fetchDashboard,
    refetch,
    activeTab: queryTab,
    setActiveTab,
    filters,
    visibleTabs,
    activeTabDef,
    visibleActions,
    filterBarActions,
    tableActions,
    config,
    selectedIds,
    toggleSelected,
    setSelectedIds,
    clearSelection
  }
}

/** Alias matching company `useDashboardData` naming. */
export function useDashboardData(): UseDashboardResult {
  return useDashboard()
}
