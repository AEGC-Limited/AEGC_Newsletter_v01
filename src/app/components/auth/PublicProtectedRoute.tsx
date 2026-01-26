'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, isTokenExpired, getToken, logout } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

interface PublicRouteProps {
  children: React.ReactNode
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken()
      
      if (token && !isTokenExpired(token)) {
        // User is authenticated, redirect to dashboard
        router.push('/')
      } else {
        // Clear any expired tokens
        if (token) {
          logout()
        }
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
