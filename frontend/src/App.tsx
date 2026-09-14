import { useEffect, useState } from 'react'
import { EmployeeTable } from './components/EmployeeTable'
import { StatusMessage } from './components/StatusMessage'
import { listEmployees } from './api/employees'
import { ApiRequestError } from './api/client'
import type { Employee, PageResponse } from './types/employee'

export default function App() {
  const [data, setData] = useState<PageResponse<Employee> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listEmployees({ page: 0, size: 10, sortField: 'lastName', sortDirection: 'asc' })
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
  }, [])

  return (
    <div className="page">
      <header className="page__header">
        <h1>Gestion des employes</h1>
      </header>

      {isLoading && <StatusMessage tone="loading">Chargement des employes...</StatusMessage>}
      {!isLoading && error && <StatusMessage tone="error">{error}</StatusMessage>}
      {!isLoading && !error && data && data.content.length === 0 && (
        <StatusMessage tone="empty">Aucun employe ne correspond a ces criteres.</StatusMessage>
      )}
      {!isLoading && !error && data && data.content.length > 0 && (
        <EmployeeTable
          employees={data.content}
          sortField="lastName"
          sortDirection="asc"
          onSort={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      )}
    </div>
  )
}
