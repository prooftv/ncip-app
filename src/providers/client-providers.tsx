'use client'

import { AuthProvider } from '@features/auth/AuthProvider'
import { OfflineProvider } from '@lib/storage/OfflineProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <OfflineProvider>
        {children}
        <ToastContainer position="bottom-center" autoClose={5000} />
      </OfflineProvider>
    </AuthProvider>
  )
}
