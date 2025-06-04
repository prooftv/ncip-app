import { useAuth } from '../AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';

export default function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const { user, role, loading } = useAuth(); // Removed roleLoading
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (role && !allowedRoles.includes(role)) {
        router.push('/unauthorized');
      }
    }
  }, [user, role, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-3xl text-blue-500 mb-4" />
        <p className="text-gray-600">Verifying access...</p>
      </div>
    );
  }

  if (user && role && allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  return null;
}