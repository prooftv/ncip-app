'use client'

import { useAuth } from '@features/auth/context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-2xl mr-2" />
        <span>Checking permissions...</span>
      </div>
    );
  }

  return <>{children}</>;
}
