'use client'

import Header from './layout/header/Header'
import Sidebar from './layout/sidebar/Sidebar'
import ProtectedRoute from '../components/auth/ProtectedRoute'


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
     <ProtectedRoute requiredRoles={['SuperAdmin', 'Admin']}>
      {/* <ToastProvider> */}
      <div className='flex w-full min-h-screen'>
        <div className='page-wrapper flex w-full'>
          {/* Header/sidebar */}
          <div className='xl:block hidden'>
            <Sidebar />
          </div>

          <div className='body-wrapper w-full xl:pl-72 pt-6 pb-6'>
            {/* Top Header  */}
            <Header />
            {/* Body Content  */}
            <div className="bg-lightgray dark:bg-dark mr-3 rounded-3xl min-h-[90vh]">
              <div className={`container mx-auto px-6 py-30`}>{children}</div>
            </div>
          </div>
        </div>
      </div>
      {/* <Toaster />
      </ToastProvider> */}
    </ProtectedRoute>
  )
}
