'use client'

import { X } from 'lucide-react'
import { Toast as ToastType } from './use-toast'
import { cn } from '@/lib/utils'

interface ToastProps {
  toast: ToastType
  onDismiss: (id: string) => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <div
      className={cn(
        'relative w-full max-w-sm rounded-lg border p-4 shadow-lg bg-white',
        toast.variant === 'destructive' &&
          'border-red-500 bg-red-50 text-red-700'
      )}
    >
      <button
        onClick={() => onDismiss(toast.id)}
        className='absolute right-2 top-2 text-gray-400 hover:text-gray-600'
      >
        <X className='h-4 w-4' />
      </button>

      {toast.title && (
        <h4 className='font-semibold text-sm'>{toast.title}</h4>
      )}
      {toast.description && (
        <p className='text-sm mt-1 opacity-90'>{toast.description}</p>
      )}
    </div>
  )
}
