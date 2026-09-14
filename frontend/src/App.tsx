import { Toolbar } from './components/Toolbar'
import { EmployeeTable } from './components/EmployeeTable'
import { Pagination } from './components/Pagination'
import { StatusMessage } from './components/StatusMessage'
import { useEmployees } from './hooks/useEmployees'
import { useDepartments } from './hooks/useDepartments'

export default function App() {
  const {
    data,
    isLoading,
    error,
    filters,
    updateFilters,
    page,
    setPage,
    sortField,
    sortDirection,
    toggleSort,
  } = useEmployees()
  const departments = useDepartments()

  return (
    <div className="page">
      <header className="page__header">
        <h1>Gestion des employes</h1>
      </header>

      <Toolbar filters={filters} departments={departments} onFiltersChange={updateFilters} onCreate={() => {}} />

      {isLoading && <StatusMessage tone="loading">Chargement des employes...</StatusMessage>}
      {!isLoading && error && <StatusMessage tone="error">{error}</StatusMessage>}
      {!isLoading && !error && data && data.content.length === 0 && (
        <StatusMessage tone="empty">Aucun employe ne correspond a ces criteres.</StatusMessage>
      )}
      {!isLoading && !error && data && data.content.length > 0 && (
        <>
          <EmployeeTable
            employees={data.content}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={toggleSort}
            onEdit={() => {}}
            onDelete={() => {}}
          />
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
