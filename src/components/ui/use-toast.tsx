'use client'

import * as React from 'react'
import type { ReactNode } from 'react'

export type ToastVariant = 'default' | 'destructive'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
}

interface ToastContextValue {
  toast: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
  toasts: Toast[]
}

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID()

    setToasts(prev => [...prev, { id, ...toast }])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}
