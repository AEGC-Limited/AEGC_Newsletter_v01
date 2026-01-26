'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated, isTokenExpired, getToken, logout, getUser, isAccountLocked, isAccountActive } from '@/lib/auth'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

export const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken()
      
      // No token found
      if (!token) {
        logout()
        router.push(`/auth/login?redirect=${pathname}`)
        return
      }

      // Token expired
      if (isTokenExpired(token)) {
        logout()
        toast({
          title: 'Session Expired',
          description: 'Your session has expired. Please log in again.',
          variant: 'destructive',
        })
        router.push(`/auth/login?redirect=${pathname}&expired=true`)
        return
      }

      const user = getUser()

      // Account locked
      if (isAccountLocked()) {
        logout()
        toast({
          title: 'Account Locked',
          description: 'Your account has been temporarily locked. Please contact support.',
          variant: 'destructive',
        })
        router.push('/auth/login?locked=true')
        return
      }

      // Account inactive
      if (!isAccountActive()) {
        logout()
        toast({
          title: 'Account Inactive',
          description: 'Your account is inactive. Please contact support.',
          variant: 'destructive',
        })
        router.push('/auth/login?inactive=true')
        return
      }

      // Check role-based access
      if (requiredRoles && requiredRoles.length > 0 && user) {
        if (!requiredRoles.includes(user.role)) {
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to access this page.',
            variant: 'destructive',
          })
          router.push('/unauthorized')
          return
        }
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, pathname, requiredRoles, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-lightgray dark:bg-dark">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
export default ProtectedRoute;