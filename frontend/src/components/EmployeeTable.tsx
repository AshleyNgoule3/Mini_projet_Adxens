import type { Employee, SortDirection, SortField } from '../types/employee'
import { StatusBadge } from './StatusBadge'

const COLUMNS: { field: SortField; label: string }[] = [
  { field: 'lastName', label: 'Nom complet' },
  { field: 'position', label: 'Poste' },
  { field: 'department', label: 'Departement' },
  { field: 'hireDate', label: "Date d'embauche" },
  { field: 'status', label: 'Statut' },
]

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

function formatHireDate(value: string): string {
  return dateFormatter.format(new Date(value))
}

interface EmployeeTableProps {
  employees: Employee[]
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
  /** Pilote par le feature flag employes-actions-ecriture. */
  ecritureActivee: boolean
}

export function EmployeeTable({
  employees,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  ecritureActivee,
}: EmployeeTableProps) {
  return (
    <div className="table-scroll">
      <table className="employee-table">
        <thead>
          <tr>
            {COLUMNS.map((column) => {
              const isActive = sortField === column.field
              return (
                <th key={column.field} aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button type="button" className="sort-button" onClick={() => onSort(column.field)}>
                    {column.label}
                    {isActive && <span aria-hidden="true">{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>}
                  </button>
                </th>
              )
            })}
            <th className="employee-table__actions-header">
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.firstName} {employee.lastName}</td>
              <td>{employee.position}</td>
              <td>{employee.department}</td>
              <td>{formatHireDate(employee.hireDate)}</td>
              <td><StatusBadge status={employee.status} /></td>
              <td className="employee-table__actions">
                {ecritureActivee && (
                  <>
                    <button type="button" onClick={() => onEdit(employee)}>
                      Modifier
                    </button>
                    <button type="button" className="button--danger" onClick={() => onDelete(employee)}>
                      Supprimer
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
