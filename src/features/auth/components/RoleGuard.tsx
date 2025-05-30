'use client'
import { useAuth } from '@features/auth/context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RoleGuard({ allowedRoles, children }: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (role && !allowedRoles.includes(role)))) {
      router.push('/unauthorized');
    }
  }, [user, role, loading]);

  if (loading || !user || (role && !allowedRoles.includes(role))) {
    return <div>Checking permissions...</div>;
  }

  return <>{children}</>;
}
