'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  messagingSupported: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  messagingSupported: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthContextType>({
    user: null,
    role: null,
    loading: true,
    messagingSupported: typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      setAuthState(prev => ({ ...prev, loading: false }));
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('[AuthProvider] Auth state changed:', user ? user.email : 'No user');
      
      // Set loading to false immediately
      setAuthState(prev => ({
        ...prev,
        user,
        loading: false,
        role: user ? 'parent' : null // Simplified role assignment
      }));
    });

    return unsubscribe;
  }, []);

  console.log('[AuthProvider] Current state:', authState);
  
  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}