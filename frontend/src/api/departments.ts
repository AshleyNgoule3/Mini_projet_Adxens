import { apiRequest } from './client'

export function listDepartments(): Promise<string[]> {
  return apiRequest<string[]>('/departments')
}
