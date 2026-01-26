'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen bg-lightgray dark:bg-dark">
      <div className="text-center p-8 max-w-md">
        <ShieldAlert className="h-20 w-20 text-destructive mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You do not have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => router.push('/')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
