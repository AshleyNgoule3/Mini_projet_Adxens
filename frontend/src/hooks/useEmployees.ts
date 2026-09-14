import { useCallback, useEffect, useState } from 'react'
import { listEmployees } from '../api/employees'
import { ApiRequestError } from '../api/client'
import type { Employee, PageResponse, SortDirection, SortField } from '../types/employee'

const PAGE_SIZE = 10

export interface EmployeeFilters {
  department: string
  status: string
  search: string
}

const INITIAL_FILTERS: EmployeeFilters = { department: '', status: '', search: '' }

interface SortState {
  field: SortField
  direction: SortDirection
}

const INITIAL_SORT: SortState = { field: 'lastName', direction: 'asc' }

export function useEmployees() {
  const [filters, setFilters] = useState<EmployeeFilters>(INITIAL_FILTERS)
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<SortState>(INITIAL_SORT)
  const [data, setData] = useState<PageResponse<Employee> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    listEmployees({
      page,
      size: PAGE_SIZE,
      sortField: sort.field,
      sortDirection: sort.direction,
      department: filters.department || undefined,
      status: filters.status || undefined,
      search: filters.search || undefined,
    })
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof ApiRequestError ? err.apiError.message : 'Impossible de charger les employes.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [page, sort, filters, reloadToken])

  const updateFilters = useCallback((patch: Partial<EmployeeFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }))
    setPage(0)
  }, [])

  const toggleSort = useCallback((field: SortField) => {
    setPage(0)
    setSort((current) => {
      if (current.field === field) {
        return { field, direction: current.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { field, direction: 'asc' }
    })
  }, [])

  const refetch = useCallback(() => setReloadToken((token) => token + 1), [])

  return {
    data,
    isLoading,
    error,
    filters,
    updateFilters,
    page,
    setPage,
    sortField: sort.field,
    sortDirection: sort.direction,
    toggleSort,
    pageSize: PAGE_SIZE,
    refetch,
  }
}
