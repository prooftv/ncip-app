'use client'

import { AuthProvider } from '@features/auth/context';

interface ClientRootProps {
  children: React.ReactNode;
}

export default function ClientRoot({ children }: ClientRootProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
