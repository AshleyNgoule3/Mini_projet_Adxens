import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useDialogA11y } from '../hooks/useDialogA11y'
import { ApiRequestError } from '../api/client'
import { createEmployee, updateEmployee } from '../api/employees'
import type { Employee, EmployeeInput, EmployeeStatus } from '../types/employee'

interface EmployeeFormModalProps {
  isOpen: boolean
  employee: Employee | null
  onClose: () => void
  onSaved: () => void
}

const EMPTY_FORM: EmployeeInput = {
  firstName: '',
  lastName: '',
  position: '',
  department: '',
  hireDate: '',
  status: 'active',
}

type FieldErrors = Partial<Record<keyof EmployeeInput, string>>

function toFormValues(employee: Employee | null): EmployeeInput {
  if (!employee) {
    return EMPTY_FORM
  }
  return {
    firstName: employee.firstName,
    lastName: employee.lastName,
    position: employee.position,
    department: employee.department,
    hireDate: employee.hireDate,
    status: employee.status,
  }
}

// Miroir des contraintes serveur (dto/EmployeeRequest.java + regle metier du
// service) pour un retour immediat ; l'API reste la source de verite finale,
// ses erreurs de validation sont affichees en plus (voir handleSubmit).
function validate(values: EmployeeInput): FieldErrors {
  const errors: FieldErrors = {}
  const requiredTextFields: (keyof EmployeeInput)[] = ['firstName', 'lastName', 'position', 'department']

  for (const field of requiredTextFields) {
    const value = values[field] as string
    if (!value.trim()) {
      errors[field] = 'Ce champ est obligatoire.'
    } else if (value.length > 100) {
      errors[field] = 'Ce champ ne doit pas depasser 100 caracteres.'
    }
  }

  if (!values.hireDate) {
    errors.hireDate = "La date d'embauche est obligatoire."
  } else if (values.hireDate > new Date().toISOString().slice(0, 10)) {
    errors.hireDate = "La date d'embauche ne peut pas etre dans le futur."
  }

  return errors
}

export function EmployeeFormModal({ isOpen, employee, onClose, onSaved }: EmployeeFormModalProps) {
  const [values, setValues] = useState<EmployeeInput>(() => toFormValues(employee))
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const firstFieldRef = useRef<HTMLInputElement>(null)

  useDialogA11y(isOpen, onClose, firstFieldRef)

  useEffect(() => {
    if (isOpen) {
      setValues(toFormValues(employee))
      setFieldErrors({})
      setFormError(null)
    }
  }, [isOpen, employee])

  if (!isOpen) {
    return null
  }

  const isEditing = employee !== null

  function handleChange<K extends keyof EmployeeInput>(field: K, value: EmployeeInput[K]) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const errors = validate(values)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setFormError(null)
    try {
      if (isEditing && employee) {
        await updateEmployee(employee.id, values)
      } else {
        await createEmployee(values)
      }
      onSaved()
    } catch (err) {
      if (err instanceof ApiRequestError) {
        const apiFieldErrors: FieldErrors = {}
        for (const detail of err.apiError.errors ?? []) {
          apiFieldErrors[detail.field as keyof EmployeeInput] = detail.message
        }
        if (Object.keys(apiFieldErrors).length > 0) {
          setFieldErrors(apiFieldErrors)
        } else {
          setFormError(err.apiError.message)
        }
      } else {
        setFormError('Une erreur inattendue est survenue.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="dialog-overlay" onMouseDown={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="employee-form-title">{isEditing ? "Modifier l'employe" : 'Ajouter un employe'}</h2>

        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label>
            Prenom
            <input
              ref={firstFieldRef}
              value={values.firstName}
              onChange={(event) => handleChange('firstName', event.target.value)}
              aria-invalid={Boolean(fieldErrors.firstName)}
            />
            {fieldErrors.firstName && <span className="field-error">{fieldErrors.firstName}</span>}
          </label>

          <label>
            Nom
            <input
              value={values.lastName}
              onChange={(event) => handleChange('lastName', event.target.value)}
              aria-invalid={Boolean(fieldErrors.lastName)}
            />
            {fieldErrors.lastName && <span className="field-error">{fieldErrors.lastName}</span>}
          </label>

          <label>
            Poste
            <input
              value={values.position}
              onChange={(event) => handleChange('position', event.target.value)}
              aria-invalid={Boolean(fieldErrors.position)}
            />
            {fieldErrors.position && <span className="field-error">{fieldErrors.position}</span>}
          </label>

          <label>
            Departement
            <input
              value={values.department}
              onChange={(event) => handleChange('department', event.target.value)}
              aria-invalid={Boolean(fieldErrors.department)}
            />
            {fieldErrors.department && <span className="field-error">{fieldErrors.department}</span>}
          </label>

          <label>
            Date d'embauche
            <input
              type="date"
              value={values.hireDate}
              onChange={(event) => handleChange('hireDate', event.target.value)}
              aria-invalid={Boolean(fieldErrors.hireDate)}
            />
            {fieldErrors.hireDate && <span className="field-error">{fieldErrors.hireDate}</span>}
          </label>

          <label>
            Statut
            <select
              value={values.status}
              onChange={(event) => handleChange('status', event.target.value as EmployeeStatus)}
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </label>

          <div className="dialog__actions">
            <button type="button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="button--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
