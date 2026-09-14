import { useState } from 'react'
import { Toolbar } from './components/Toolbar'
import { EmployeeTable } from './components/EmployeeTable'
import { Pagination } from './components/Pagination'
import { StatusMessage } from './components/StatusMessage'
import { EmployeeFormModal } from './components/EmployeeFormModal'
import { ConfirmDialog } from './components/ConfirmDialog'
import { useEmployees } from './hooks/useEmployees'
import { useDepartments } from './hooks/useDepartments'
import { deleteEmployee } from './api/employees'
import { ApiRequestError } from './api/client'
import type { Employee } from './types/employee'

interface FormState {
  isOpen: boolean
  employee: Employee | null
}

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
    refetch,
  } = useEmployees()
  const departments = useDepartments()

  const [formState, setFormState] = useState<FormState>({ isOpen: false, employee: null })
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  function openCreateForm() {
    setFormState({ isOpen: true, employee: null })
  }

  function openEditForm(employee: Employee) {
    setFormState({ isOpen: true, employee })
  }

  function closeForm() {
    setFormState((prev) => ({ ...prev, isOpen: false }))
  }

  function handleSaved() {
    closeForm()
    refetch()
  }

  function openDeleteConfirm(employee: Employee) {
    setDeleteError(null)
    setDeleteTarget(employee)
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return
    }
    try {
      await deleteEmployee(deleteTarget.id)
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      setDeleteError(err instanceof ApiRequestError ? err.apiError.message : 'Suppression impossible.')
    }
  }

  return (
    <div className="page">
      <header className="page__header">
        <h1>Gestion des employes</h1>
      </header>

      <Toolbar filters={filters} departments={departments} onFiltersChange={updateFilters} onCreate={openCreateForm} />

      {deleteError && <StatusMessage tone="error">{deleteError}</StatusMessage>}
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
            onEdit={openEditForm}
            onDelete={openDeleteConfirm}
          />
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}

      <EmployeeFormModal isOpen={formState.isOpen} employee={formState.employee} onClose={closeForm} onSaved={handleSaved} />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Supprimer l'employe"
        message={deleteTarget ? `Confirmer la suppression de ${deleteTarget.firstName} ${deleteTarget.lastName} ?` : ''}
        confirmLabel="Supprimer"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
