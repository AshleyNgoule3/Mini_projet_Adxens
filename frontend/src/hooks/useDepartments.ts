import { useEffect, useState } from 'react'
import { listDepartments } from '../api/departments'

export function useDepartments() {
  const [departments, setDepartments] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    listDepartments()
      .then((result) => {
        if (!cancelled) setDepartments(result)
      })
      .catch(() => {
        if (!cancelled) setDepartments([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  return departments
}
