// src/features/auth/components/RoleGuard.tsx
'use client'
import { useAuth } from '../AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { UserRole } from '../AuthProvider';

export default function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}) {
  const { user, role, loading, refreshRole } = useAuth();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyAccess = async () => {
      if (!loading) {
        if (!user) {
          router.push('/login');
          return;
        }

        // Check if user has admin email but wrong role
        const adminEmails = ['admin@unamifoundation.org', 'info@unamifoundation.org'];
        const isAdminEmail = adminEmails.includes(user.email?.toLowerCase() || '');

        if (role && allowedRoles.includes(role)) {
          setVerifying(false);
          return;
        }

        // Double check role for admin emails
        if (isAdminEmail && refreshRole) {
          try {
            const refreshedRole = await refreshRole();
            if (refreshedRole && allowedRoles.includes(refreshedRole)) {
              setVerifying(false);
              return;
            }
          } catch (error) {
            console.error("Role refresh failed:", error);
          }
        }

        router.push('/unauthorized');
      }
    };

    verifyAccess();
  }, [user, role, loading, allowedRoles, router, refreshRole]);

  if (loading || verifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-3xl text-blue-500 mb-4" />
        <p className="text-gray-600">Verifying access...</p>
      </div>
    );
  }

  return <>{children}</>;
}