// 'use client'

// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { authApi } from '@/lib/api'
// import { LogOut } from 'lucide-react'
// import { useToast } from '@/components/ui/use-toast'

// interface LogoutButtonProps {
//   variant?: 'default' | 'ghost' | 'outline'
//   className?: string
//   showIcon?: boolean
// }

// export const LogoutButton = ({ 
//   variant = 'ghost', 
//   className = '',
//   showIcon = true 
// }: LogoutButtonProps) => {
//   const router = useRouter()
//   const { toast } = useToast()

//   const handleLogout = () => {
//     authApi.logout()
//     toast({
//       title: 'Logged Out',
//       description: 'You have been logged out successfully.',
//     })
//     router.push('/auth/login')
//   }

//   return (
//     <Button variant={variant} onClick={handleLogout} className={className}>
//       {showIcon && <LogOut className="mr-2 h-4 w-4" />}
//       Logout
//     </Button>
//   )
// }




// components/auth/LogoutButton.tsx   (or wherever it lives)
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { authApi } from '@/lib/api'
import { LogOut } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface LogoutButtonProps {
  variant?: 'default' | 'ghost' | 'outline' | 'link' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
}

export const LogoutButton = ({ 
  variant = 'ghost',
  size = 'default',
  className = '',
  showIcon = true,
  children = 'Logout',
}: LogoutButtonProps) => {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await authApi.logout()           // assuming this is async
      toast({
        title: 'Logged Out',
        description: 'You have been logged out successfully.',
      })
      router.push('/auth/login')
      router.refresh()                 // optional: help clear any server cache
    } catch (err) {
      toast({
        title: 'Logout failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={className}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children}
    </Button>
  )
}