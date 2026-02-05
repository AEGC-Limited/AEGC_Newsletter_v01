// // Updated api.ts (authApi and related)

import { User } from "./auth"

// // Adjust API_URL if needed; assuming case-insensitivity for /api/Auth/login vs /api/auth/login
// export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5283';

// export interface ApiError {
//   message: string;
//   errors?: Record<string, string[]>;
// }

// export async function apiRequest<T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const url = `${API_URL}${endpoint}`;
  
//   const config: RequestInit = {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     },
//   };
//   // Add auth token if available
//   const token = localStorage.getItem('token') || sessionStorage.getItem('token');
//   if (token) {
//     config.headers = {
//       ...config.headers,
//       Authorization: `Bearer ${token}`,
//     };
//   }
//   const response = await fetch(url, config);
//   const data = await response.json();
//   if (!response.ok) {
//     throw new Error(data.message || 'An error occurred');
//   }
//   return data;
// }

// // Updated LoginResponse to match backend schema
// export interface LoginResponse {
//   accessToken: string;
//   expiresAt: string;
//   user: {
//     id: number;
//     username: string;
//     email: string;
//     role: string;
//     isActive: boolean;
//     lastLoginAt: string;
//     createdAt: string;
//     failedLoginAttempts: number;
//     lockedUntil: string | null;
//   };
//   message: string;
// }

// // Auth API functions
// export const authApi = {
//   login: async (username: string, password: string, rememberMe: boolean) => {
//     return apiRequest<LoginResponse>('/api/Auth/login', {  // Adjusted endpoint to match provided URL (capital 'A' in Auth)
//       method: 'POST',
//       body: JSON.stringify({ username, password, rememberMe }),
//     });
//   },
//   logout: () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     sessionStorage.removeItem('token');
//     sessionStorage.removeItem('user');
//   },
//   getCurrentUser: () => {
//     const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
//     return userStr ? JSON.parse(userStr) : null;
//   },
//   isAuthenticated: () => {
//     return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
//   },
// };



export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5283'

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  // Add auth token if available
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  const response = await fetch(url, config)
  
  // Handle 401 Unauthorized - token expired or invalid
  if (response.status === 401) {
    // Clear auth data and redirect to login
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    window.location.href = '/auth/login?expired=true'
    throw new Error('Session expired. Please log in again.')
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred')
  }

  return data
}

export interface LoginResponse {
  accessToken: string
  expiresAt: string
  user: {
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
  message: string
}

export const authApi = {
  login: async (username: string, password: string) => {
    return apiRequest<LoginResponse>('/api/Auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  },
  
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  },
  
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
  
  isAuthenticated: () => {
    return !!(localStorage.getItem('token') || sessionStorage.getItem('token'))
  },
}