'use client'

import { Toast } from './toast'
import { useToast } from './use-toast'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className='fixed top-4 right-4 z-50 flex flex-col gap-3'>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={dismiss}
        />
      ))}
    </div>
  )
}
