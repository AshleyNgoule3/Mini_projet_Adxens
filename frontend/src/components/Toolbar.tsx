import { useEffect, useRef, useState } from 'react'
import type { EmployeeFilters } from '../hooks/useEmployees'

interface ToolbarProps {
  filters: EmployeeFilters
  departments: string[]
  onFiltersChange: (patch: Partial<EmployeeFilters>) => void
  onCreate: () => void
}

const SEARCH_DEBOUNCE_MS = 300

export function Toolbar({ filters, departments, onFiltersChange, onCreate }: ToolbarProps) {
  const [searchInput, setSearchInput] = useState(filters.search)
  const lastCommittedSearchRef = useRef(filters.search)
  const onFiltersChangeRef = useRef(onFiltersChange)
  onFiltersChangeRef.current = onFiltersChange

  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchInput !== lastCommittedSearchRef.current) {
        lastCommittedSearchRef.current = searchInput
        onFiltersChangeRef.current({ search: searchInput })
      }
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [searchInput])

  return (
    <div className="toolbar">
      <input
        type="search"
        className="toolbar__search"
        placeholder="Rechercher un nom ou prenom..."
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        aria-label="Rechercher un employe"
      />

      <select
        value={filters.department}
        onChange={(event) => onFiltersChange({ department: event.target.value })}
        aria-label="Filtrer par departement"
      >
        <option value="">Tous les departements</option>
        {departments.map((department) => (
          <option key={department} value={department}>
            {department}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(event) => onFiltersChange({ status: event.target.value })}
        aria-label="Filtrer par statut"
      >
        <option value="">Tous les statuts</option>
        <option value="active">Actif</option>
        <option value="inactive">Inactif</option>
      </select>

      <button type="button" className="button--primary toolbar__create" onClick={onCreate}>
        Ajouter un employe
      </button>
    </div>
  )
}
