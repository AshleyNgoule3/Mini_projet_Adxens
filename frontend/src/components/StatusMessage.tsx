import type { ReactNode } from 'react'

interface StatusMessageProps {
  tone: 'loading' | 'error' | 'empty'
  children: ReactNode
}

export function StatusMessage({ tone, children }: StatusMessageProps) {
  return (
    <div className={`status-message status-message--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  )
}
