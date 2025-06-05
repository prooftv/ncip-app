// src/components/DebugAuth.tsx
'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '@features/auth/AuthProvider';
import { signInAnonymously, signOut } from 'firebase/auth';
import { auth } from '@lib/firebase/config';

export default function DebugAuth() {
  const { user, role, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="debug-auth">
      <h3>Auth Debug Info</h3>
      <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
      <p><strong>User:</strong> {user?.email || 'None'}</p>
      <p><strong>Role:</strong> {role || 'None'}</p>
      <p><strong>Auth Instance:</strong> {auth ? 'Initialized' : 'Not initialized'}</p>
      
      <div className="buttons">
        <button onClick={() => signInAnonymously(auth)}>
          Sign In Anonymously
        </button>
        <button onClick={() => signOut(auth)}>
          Sign Out
        </button>
      </div>
    </div>
  );
}