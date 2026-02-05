'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'

interface User {
  id: number
  username: string
  email: string
  role: string
  // Add more fields from backend if needed, e.g., isActive: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string, rememberMe: boolean) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = authApi.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const data = await authApi.login(username, password)
    
    const userData: User = {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      role: data.user.role
      // Add more if needed
    }

    // Store based on remember me preference
    const storage = localStorage
    storage.setItem('token', data.accessToken)  // Updated to accessToken
    storage.setItem('user', JSON.stringify(userData))

    setUser(userData)

    // Redirect based on role
    if (data.user.role === 'SuperAdmin' || data.user.role === 'Admin') {
      router.push('/dashboard')
    } else if (data.user.role === 'MSME') {
      router.push('/msme/dashboard')
    } else {
      router.push('/')
    }
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
    router.push('/auth/login')
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}