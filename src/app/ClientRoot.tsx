'use client'

import { AuthProvider } from '@features/auth/context'

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
