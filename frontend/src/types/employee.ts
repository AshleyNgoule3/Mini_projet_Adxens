// Types alignes sur le contrat reel du backend (voir backend/src/main/java/
// com/adxens/gestionemployes/{dto,entity,exception}) — ne pas inventer de
// champ ou de forme non presente cote serveur.

export type EmployeeStatus = 'active' | 'inactive'

export interface Employee {
  id: number
  firstName: string
  lastName: string
  position: string
  department: string
  hireDate: string // ISO yyyy-MM-dd
  status: EmployeeStatus
  createdAt: string
  updatedAt: string
}

export interface EmployeeInput {
  firstName: string
  lastName: string
  position: string
  department: string
  hireDate: string
  status: EmployeeStatus
}

// Forme propre au projet (dto/PageResponse.java), pas celle de Spring Data.
export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface ValidationErrorDetail {
  field: string
  message: string
}

// exception/ApiError.java : "errors" absent (pas juste vide) hors validation.
export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
  errors?: ValidationErrorDetail[]
}

// Sous-ensemble des champs triables cote backend (EmployeeController.
// SORTABLE_FIELDS) correspondant aux colonnes affichees dans le tableau.
export const SORTABLE_FIELDS = ['lastName', 'position', 'department', 'hireDate', 'status'] as const
export type SortField = (typeof SORTABLE_FIELDS)[number]
export type SortDirection = 'asc' | 'desc'
