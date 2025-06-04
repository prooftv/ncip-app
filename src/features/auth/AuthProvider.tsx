'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInAnonymously } from 'firebase/auth';
import { auth } from '@lib/firebase/config';

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  messagingSupported: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  messagingSupported: false,
  signIn: async () => {},
  signOut: async () => {}
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagingSupported = typeof window !== 'undefined' && 
                            'serviceWorker' in navigator && 
                            'PushManager' in window;

  // Sign in anonymously
  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInAnonymously(auth);
      setUser(result.user);
      setRole('parent');
      setLoading(false);
    } catch (error) {
      console.error('Anonymous sign-in failed:', error);
      setLoading(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      setUser(null);
      setRole(null);
      setLoading(false);
    } catch (error) {
      console.error('Sign out failed:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    if (!auth) {
      console.error('Firebase auth not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('[AuthProvider] Auth state changed:', currentUser ? currentUser.uid : 'No user');
      
      if (currentUser) {
        setUser(currentUser);
        setRole('parent');
        setLoading(false);
      } else {
        console.log('No user found');
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    }, (error) => {
      console.error('[AuthProvider] Auth state error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authState = {
    user,
    role,
    loading,
    messagingSupported,
    signIn: handleSignIn,
    signOut: handleSignOut
  };

  console.log('[AuthProvider] Current state:', authState);
  
  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}