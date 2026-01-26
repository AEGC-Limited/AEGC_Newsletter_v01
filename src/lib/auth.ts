export interface User {
  id: number
  username: string
  email: string
  role: string
  isActive: boolean
  lastLoginAt: string
  createdAt: string
  failedLoginAttempts: number
  lockedUntil: string | null
}

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export const isAuthenticated = (): boolean => {
  return !!getToken()
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user')
}

export const isTokenExpired = (token: string): boolean => {
  try {
    // Parse JWT token
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiry = payload.exp * 1000 // Convert to milliseconds
    return Date.now() >= expiry
  } catch {
    return true
  }
}

// Check if user account is locked
export const isAccountLocked = (): boolean => {
  const user = getUser()
  if (!user || !user.lockedUntil) return false
  return new Date(user.lockedUntil) > new Date()
}

// Check if user is active
export const isAccountActive = (): boolean => {
  const user = getUser()
  return user?.isActive ?? false
}
