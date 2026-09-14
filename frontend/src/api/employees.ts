import { apiRequest } from './client'
import type { Employee, EmployeeInput, PageResponse, SortDirection, SortField } from '../types/employee'

export interface ListEmployeesParams {
  page: number
  size: number
  sortField: SortField
  sortDirection: SortDirection
  department?: string
  status?: string
  search?: string
}

export function listEmployees(params: ListEmployeesParams): Promise<PageResponse<Employee>> {
  return apiRequest<PageResponse<Employee>>('/employees', {
    searchParams: {
      page: params.page,
      size: params.size,
      sort: `${params.sortField},${params.sortDirection}`,
      department: params.department,
      status: params.status,
      search: params.search,
    },
  })
}

export function getEmployee(id: number): Promise<Employee> {
  return apiRequest<Employee>(`/employees/${id}`)
}

export function createEmployee(input: EmployeeInput): Promise<Employee> {
  return apiRequest<Employee>('/employees', { method: 'POST', body: input })
}

export function updateEmployee(id: number, input: EmployeeInput): Promise<Employee> {
  return apiRequest<Employee>(`/employees/${id}`, { method: 'PUT', body: input })
}

export function deleteEmployee(id: number): Promise<void> {
  return apiRequest<void>(`/employees/${id}`, { method: 'DELETE' })
}
