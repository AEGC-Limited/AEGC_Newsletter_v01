


// 'use client';
// import { useState, FormEvent } from 'react'
// import { useRouter } from 'next/navigation'
// import FullLogo from '@/app/(DashboardLayout)/layout/shared/logo/FullLogo'
// import Link from 'next/link'
// import { Label } from '@/components/ui/label'
// import { Checkbox } from '@/components/ui/checkbox'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { FcGoogle } from 'react-icons/fc'
// import { useToast } from '@/components/ui/use-toast'
// import { Loader2 } from 'lucide-react'
// import { LoginResponse } from '@/lib/api'  // Import the updated interface

// export const Login = () => {
//   const router = useRouter()
//   const { toast } = useToast()
  
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     rememberMe: false
//   })
//   const [loading, setLoading] = useState(false)
//   const [errors, setErrors] = useState({
//     username: '',
//     password: '',
//     general: ''
//   })
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [id]: value
//     }))
//     // Clear error when user types
//     setErrors(prev => ({
//       ...prev,
//       [id]: '',
//       general: ''
//     }))
//   }
//   const validateForm = () => {
//     let isValid = true
//     const newErrors = {
//       username: '',
//       password: '',
//       general: ''
//     }
//     // Username validation
//     if (!formData.username.trim()) {
//       newErrors.username = 'Username is required'
//       isValid = false
//     }
//     // Password validation
//     if (!formData.password) {
//       newErrors.password = 'Password is required'
//       isValid = false
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters'
//       isValid = false
//     }
//     setErrors(newErrors)
//     return isValid
//   }
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     // Validate form
//     if (!validateForm()) {
//       return
//     }
//     setLoading(true)
//     setErrors({ username: '', password: '', general: '' })
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: formData.username,
//           password: formData.password,
//           rememberMe: formData.rememberMe
//         }),
//       })
//       const data: LoginResponse = await response.json()
//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed')
//       }
//       // Store token and user data
//       const token = data.accessToken
//       const userData = {
//         id: data.user.id,
//         username: data.user.username,
//         email: data.user.email,
//         role: data.user.role
//         // You can add more fields like isActive if needed
//       }
//       const storage = formData.rememberMe ? localStorage : sessionStorage
//       storage.setItem('token', token)
//       storage.setItem('user', JSON.stringify(userData))
//       // Show success message
//       toast({
//         title: 'Success!',
//         description: 'You have been logged in successfully.',
//         variant: 'default',
//       })
//       // Redirect based on role
//       setTimeout(() => {
//         if (data.user.role === 'SuperAdmin' || data.user.role === 'Admin') {
//           router.push('/')
//         }
        
//       //} else if (data.user.role === 'MSME') {
//         //   router.push('/msme/dashboard')
//         // } else {
//         //   router.push('/')
//         // }
//       }, 500)
//     } catch (error: any) {
//       console.error('Login error:', error)
      
//       setErrors(prev => ({
//         ...prev,
//         general: error.message || 'Invalid username or password. Please try again.'
//       }))
//       toast({
//         title: 'Login Failed',
//         description: error.message || 'Invalid username or password. Please try again.',
//         variant: 'destructive',
//       })
//     } finally {
//       setLoading(false)
//     }
//   }
//   return (
//     <div className='h-screen w-full flex overflow-hidden'>
//       {/* Left Side - Login Form */}
//       <div className='w-full lg:w-1/2 flex items-center justify-center bg-white p-8'>
//         <div className='w-full max-w-md'>
//           {/* Logo */}
//           <div className='mb-8'>
//             <FullLogo />
//           </div>
//           {/* Welcome Text */}
//           <div className='mb-8'>
//             <h1 className='text-3xl font-bold text-gray-900 mb-2'>
//               Welcome back
//             </h1>
//             <p className='text-sm text-gray-600'>
//               Please enter your details
//             </p>
//           </div>
//           {/* General Error Message */}
//           {errors.general && (
//             <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
//               <p className='text-sm text-red-600'>{errors.general}</p>
//             </div>
//           )}
//           {/* Login Form */}
//           <form onSubmit={handleSubmit} className='space-y-5'>
//             {/* Username Input */}
//             <div>
//               <Label htmlFor='username' className='font-medium text-gray-700 mb-2'>
//                 Username
//               </Label>
//               <Input
//                 id='username'
//                 type='text'
//                 placeholder='Enter your username'
//                 className={`mt-1 ${errors.username ? 'border-red-500' : ''}`}
//                 value={formData.username}
//                 onChange={handleInputChange}
//                 disabled={loading}
//                 required
//               />
//               {errors.username && (
//                 <p className='text-sm text-red-600 mt-1'>{errors.username}</p>
//               )}
//             </div>
//             {/* Password Input */}
//             <div>
//               <Label htmlFor='password' className='font-medium text-gray-700 mb-2'>
//                 Password
//               </Label>
//               <Input
//                 id='password'
//                 type='password'
//                 placeholder='Enter your password'
//                 className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 disabled={loading}
//                 required
//               />
//               {errors.password && (
//                 <p className='text-sm text-red-600 mt-1'>{errors.password}</p>
//               )}
//             </div>
//             {/* Remember & Forgot Password */}
//             <div className='flex items-center justify-between'>
//               <div className='flex items-center gap-2'>
//                 <Checkbox
//                   id='rememberMe'
//                   checked={formData.rememberMe}
//                   onCheckedChange={(checked) =>
//                     setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
//                   }
//                   disabled={loading}
//                 />
//                 <Label
//                   className='text-sm font-normal text-gray-700 cursor-pointer'
//                   htmlFor='rememberMe'>
//                   Remember for 30 days
//                 </Label>
//               </div>
//               <Link
//                 href='/auth/forgot-password'
//                 className='text-sm font-medium text-primary hover:text-primaryemphasis'>
//                 Forgot password
//               </Link>
//             </div>
//             {/* Sign In Button */}
//             <Button
//               className='w-full bg-primary hover:bg-primaryemphasis'
//               size='lg'
//               type='submit'
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className='mr-2 h-4 w-4 animate-spin' />
//                   Signing in...
//                 </>
//               ) : (
//                 'Sign in'
//               )}
//             </Button>
//             {/* Google Sign In */}
//             <Button
//               variant='outline'
//               className='w-full'
//               size='lg'
//               type='button'
//               disabled={loading}
//             >
//               <FcGoogle className='mr-2 h-5 w-5' />
//               Sign in with Google
//             </Button>
//             {/* Sign Up Link */}
//             <div className='text-center pt-2'>
//               <span className='text-sm text-gray-600'>
//                 Don't have an account?{' '}
//               </span>
//               <Link
//                 href='/auth/register'
//                 className='text-sm font-medium text-primary hover:text-primaryemphasis'>
//                 Sign up
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//       {/* Right Side - Illustration (same as before) */}
//       <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-400 via-purple-300 to-purple-200 relative overflow-hidden'>
//         {/* ... (keep the illustration code from previous response) ... */}
//       </div>
//     </div>
//   )
// }





'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import FullLogo from '@/app/(DashboardLayout)/layout/shared/logo/FullLogo'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FcGoogle } from 'react-icons/fc'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { authApi, LoginResponse } from '@/lib/api'

export const Login = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const redirect = searchParams.get('redirect') || '/'
  const expired = searchParams.get('expired')
  const locked = searchParams.get('locked')
  const inactive = searchParams.get('inactive')

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: ''
  })

  useEffect(() => {
    if (expired === 'true') {
      toast({
        title: 'Session Expired',
        description: 'Your session has expired. Please log in again.',
        variant: 'destructive',
      })
    }
    if (locked === 'true') {
      toast({
        title: 'Account Locked',
        description: 'Your account has been temporarily locked due to multiple failed login attempts.',
        variant: 'destructive',
      })
    }
    if (inactive === 'true') {
      toast({
        title: 'Account Inactive',
        description: 'Your account is currently inactive. Please contact support.',
        variant: 'destructive',
      })
    }
  }, [expired, locked, inactive, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
    setErrors(prev => ({
      ...prev,
      [id]: '',
      general: ''
    }))
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      username: '',
      password: '',
      general: ''
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({ username: '', password: '', general: '' })

    try {
      const data: LoginResponse = await authApi.login(
        formData.username,
        formData.password,
        formData.rememberMe
      )

      // Check if account is locked
      if (data.user.lockedUntil && new Date(data.user.lockedUntil) > new Date()) {
        throw new Error('Your account is temporarily locked. Please try again later.')
      }

      // Check if account is active
      if (!data.user.isActive) {
        throw new Error('Your account is inactive. Please contact support.')
      }

      // Store token and user data
      const storage = formData.rememberMe ? localStorage : sessionStorage
      storage.setItem('token', data.accessToken)
      storage.setItem('user', JSON.stringify(data.user))

      toast({
        title: 'Success!',
        description: 'You have been logged in successfully.',
        variant: 'default',
      })

      // Redirect to intended page or dashboard
      setTimeout(() => {
        router.push(redirect)
      }, 500)

    } catch (error: any) {
      console.error('Login error:', error)
      
      setErrors(prev => ({
        ...prev,
        general: error.message || 'Invalid username or password. Please try again.'
      }))

      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid username or password. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-screen w-full flex overflow-hidden'>
      {/* Left Side - Login Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center bg-white p-8'>
        <div className='w-full max-w-md'>
          <div className='mb-8'>
            <FullLogo />
          </div>

          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Welcome back
            </h1>
            <p className='text-sm text-gray-600'>
              Please enter your details
            </p>
          </div>

          {errors.general && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-sm text-red-600'>{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <Label htmlFor='username' className='font-medium text-gray-700 mb-2'>
                Username
              </Label>
              <Input
                id='username'
                type='text'
                placeholder='Enter your username'
                className={`mt-1 ${errors.username ? 'border-red-500' : ''}`}
                value={formData.username}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
              {errors.username && (
                <p className='text-sm text-red-600 mt-1'>{errors.username}</p>
              )}
            </div>

            <div>
              <Label htmlFor='password' className='font-medium text-gray-700 mb-2'>
                Password
              </Label>
              <Input
                id='password'
                type='password'
                placeholder='Enter your password'
                className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
              {errors.password && (
                <p className='text-sm text-red-600 mt-1'>{errors.password}</p>
              )}
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Checkbox
                  id='rememberMe'
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                  }
                  disabled={loading}
                />
                <Label
                  className='text-sm font-normal text-gray-700 cursor-pointer'
                  htmlFor='rememberMe'>
                  Remember for 30 days
                </Label>
              </div>
              <Link
                href='/auth/forgot-password'
                className='text-sm font-medium text-primary hover:text-primaryemphasis'>
                Forgot password
              </Link>
            </div>

            <Button
              className='w-full bg-primary hover:bg-primaryemphasis'
              size='lg'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>

            {/* <Button
              variant='outline'
              className='w-full'
              size='lg'
              type='button'
              disabled={loading}
            >
              <FcGoogle className='mr-2 h-5 w-5' />
              Sign in with Google
            </Button> */}

            {/* <div className='text-center pt-2'>
              <span className='text-sm text-gray-600'>
                Don't have an account?{' '}
              </span>
              <Link
                href='/auth/register'
                className='text-sm font-medium text-primary hover:text-primaryemphasis'>
                Sign up
              </Link>
            </div> */}
          </form>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-400 via-purple-300 to-purple-200 relative overflow-hidden'>
        {/* Illustration code here */}
      </div>
    </div>
  )
}
