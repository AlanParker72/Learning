import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fetchDeliveries,
  type Delivery,
  type DeliveryComment,
  type FetchParams,
  type SearchField
} from '../api/mockApi'
import type { DashboardRangeUi } from '../api/contracts'

export type DeliverySortField = 'dateTime'
export type DeliverySortDir = 'asc' | 'desc'

export type DeliveryFilters = {
  searchBy: SearchField
  search: string
  status: string[]
  channel: string
  tableRange: string
}

export const DEFAULT_DELIVERY_FILTERS: DeliveryFilters = {
  searchBy: 'customerId',
  search: '',
  status: [],
  channel: 'all',
  tableRange: 'Last 7 days'
}

const readFiltersFromUrl = (): DeliveryFilters => {
  const params = new URLSearchParams(window.location.search)
  const statusParam = params.get('status')

  return {
    searchBy: (params.get('searchBy') as SearchField) || 'customerId',
    search: params.get('search') ?? '',
    status: statusParam ? statusParam.split(',').map((item) => item.trim()).filter(Boolean) : [],
    channel: params.get('channel') ?? 'all',
    tableRange: params.get('range') ?? 'Last 7 days'
  }
}

const writeFiltersToUrl = (filters: DeliveryFilters) => {
  const params = new URLSearchParams()
  if (filters.searchBy !== 'customerId') params.set('searchBy', filters.searchBy)
  if (filters.search) params.set('search', filters.search)
  if (filters.status.length > 0) params.set('status', filters.status.join(','))
  if (filters.channel !== 'all') params.set('channel', filters.channel)
  if (filters.tableRange !== 'Last 7 days') params.set('range', filters.tableRange)

  const next = params.toString()
  window.history.replaceState({}, '', next ? `${window.location.pathname}?${next}` : window.location.pathname)
}

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unable to load deliveries'

export function useDeliveries(range: DashboardRangeUi) {
  const [draftFilters, setDraftFilters] = useState<DeliveryFilters>(readFiltersFromUrl)
  const [appliedFilters, setAppliedFilters] = useState<DeliveryFilters>(readFiltersFromUrl)
  const [rows, setRows] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sortField, setSortField] = useState<DeliverySortField>('dateTime')
  const [sortDir, setSortDir] = useState<DeliverySortDir>('desc')
  const [commentOverrides, setCommentOverrides] = useState<Record<string, DeliveryComment[]>>({})

  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  const loadRows = useCallback(
    async (filters: DeliveryFilters, nextPage: number, nextPageSize: number, nextSortField: DeliverySortField, nextSortDir: DeliverySortDir) => {
      setLoading(true)
      try {
        const query: FetchParams = {
          search: filters.search,
          searchBy: filters.searchBy,
          status: filters.status,
          channel: filters.channel,
          range,
          tableRange: filters.tableRange,
          page: nextPage,
          pageSize: nextPageSize,
          sortField: nextSortField,
          sortDir: nextSortDir
        }
        const result = await fetchDeliveries(query)
        setRows(result.items)
        setTotal(result.total)
        setSelectedIds((current) => current.filter((id) => result.items.some((item) => item.id === id)))
        setError(null)
      } catch (cause) {
        setError(errorMessage(cause))
        setRows([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    },
    [range]
  )

  useEffect(() => {
    writeFiltersToUrl(appliedFilters)
    void loadRows(appliedFilters, page, pageSize, sortField, sortDir)
  }, [appliedFilters, loadRows, page, pageSize, sortDir, sortField])

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount))
  }, [pageCount])

  const applyFilters = useCallback(() => {
    setAppliedFilters(draftFilters)
    setPage(1)
    setSelectedIds([])
  }, [draftFilters])

  const resetFilters = useCallback(() => {
    setDraftFilters(DEFAULT_DELIVERY_FILTERS)
    setAppliedFilters(DEFAULT_DELIVERY_FILTERS)
    setPage(1)
    setSelectedIds([])
  }, [])

  const toggleSort = useCallback((field: DeliverySortField) => {
    setSortField(field)
    setSortDir((current) => (sortField === field && current === 'desc' ? 'asc' : 'desc'))
    setPage(1)
  }, [sortField])

  const allVisibleSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(row.id))
  const someVisibleSelected = rows.some((row) => selectedIds.includes(row.id))

  const toggleAllVisible = useCallback(() => {
    setSelectedIds((current) => {
      if (allVisibleSelected) {
        return current.filter((id) => !rows.some((row) => row.id === id))
      }
      const merged = new Set([...current, ...rows.map((row) => row.id)])
      return Array.from(merged)
    })
  }, [allVisibleSelected, rows])

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }, [])

  const clearSelection = useCallback(() => setSelectedIds([]), [])

  const commentsFor = useCallback(
    (row: Delivery): DeliveryComment[] => commentOverrides[row.id] ?? row.comments,
    [commentOverrides]
  )

  const prependComment = useCallback((ids: string[], comment: DeliveryComment) => {
    setCommentOverrides((current) => {
      const next = { ...current }
      ids.forEach((id) => {
        const existing = next[id] ?? rows.find((row) => row.id === id)?.comments ?? []
        next[id] = [comment, ...existing]
      })
      return next
    })
  }, [rows])

  const pageNumbers = useMemo(() => {
    const pages = new Set<number>([1, pageCount, page])
    for (let i = Math.max(1, page - 1); i <= Math.min(pageCount, page + 1); i += 1) {
      pages.add(i)
    }
    return Array.from(pages).sort((a, b) => a - b)
  }, [page, pageCount])

  return {
    draftFilters,
    setDraftFilters,
    applyFilters,
    resetFilters,
    rows,
    loading,
    error,
    reload: () => void loadRows(appliedFilters, page, pageSize, sortField, sortDir),
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    pageCount,
    pageNumbers,
    selectedIds,
    allVisibleSelected,
    someVisibleSelected,
    toggleAllVisible,
    toggleRow,
    clearSelection,
    sortField,
    sortDir,
    toggleSort,
    commentsFor,
    prependComment
  }
}
