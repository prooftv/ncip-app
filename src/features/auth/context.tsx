'use client'

import { User, onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '@lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@lib/firebase/config';
import { isMessagingSupported } from '@lib/firebase/messaging';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  role: 'parent' | 'admin' | 'school' | null;
  messagingSupported: boolean;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  messagingSupported: true,
  setUser: () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'parent' | 'admin' | 'school' | null>(null);
  const [messagingSupported, setMessagingSupported] = useState(true);

  useEffect(() => {
    const checkMessagingSupport = async () => {
      const supported = await isMessagingSupported();
      setMessagingSupported(supported);
    };

    checkMessagingSupport();
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // ... existing auth state handling ...
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, role, messagingSupported, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
