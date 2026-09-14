import { useRef } from 'react'
import { useDialogA11y } from '../hooks/useDialogA11y'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmer',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  useDialogA11y(isOpen, onCancel, confirmButtonRef)

  if (!isOpen) {
    return null
  }

  return (
    <div className="dialog-overlay" onMouseDown={onCancel}>
      <div
        className="dialog dialog--small"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-dialog-title">{title}</h2>
        <p>{message}</p>
        <div className="dialog__actions">
          <button type="button" onClick={onCancel}>
            Annuler
          </button>
          <button type="button" ref={confirmButtonRef} className="button--danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
