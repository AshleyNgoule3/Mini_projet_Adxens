import type { EmployeeStatus } from '../types/employee'

const LABELS: Record<EmployeeStatus, string> = {
  active: 'Actif',
  inactive: 'Inactif',
}

interface StatusBadgeProps {
  status: EmployeeStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${status}`}>{LABELS[status]}</span>
}
