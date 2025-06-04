'use client'

import { User, onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '@lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@lib/firebase/config';
import { canUseMessaging } from '@lib/firebase/messaging';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  role: 'parent' | 'admin' | 'school' | null;
  roleLoading: boolean;
  messagingSupported: boolean;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  roleLoading: true,
  messagingSupported: true,
  setUser: () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'parent' | 'admin' | 'school' | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [messagingSupported, setMessagingSupported] = useState(true);

  useEffect(() => {
    console.log("[AuthProvider] Initializing auth context");
    setMessagingSupported(canUseMessaging());
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("[AuthProvider] Auth state changed:", currentUser ? currentUser.email : "No user");
      
      if (currentUser) {
        console.log("[AuthProvider] User detected:", currentUser.email);
        setUser(currentUser);
        setRoleLoading(true);
        
        try {
          console.log(`[AuthProvider] Fetching role for user: ${currentUser.uid}`);
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          
          if (userDoc.exists()) {
            console.log("[AuthProvider] User document found:", userDoc.data());
            setRole(userDoc.data().role);
          } else {
            console.warn("[AuthProvider] User document not found");
            setRole(null);
          }
        } catch (error) {
          console.error("[AuthProvider] Error fetching user role:", error);
          setRole(null);
        } finally {
          setRoleLoading(false);
        }
      } else {
        console.log("[AuthProvider] No authenticated user");
        setUser(null);
        setRole(null);
        setRoleLoading(false);
      }
      setLoading(false);
    });

    return () => {
      console.log("[AuthProvider] Cleaning up auth listener");
      unsubscribe();
    };
  }, []);

  console.log("[AuthProvider] Current state:", { 
    user: user?.email, 
    role, 
    loading, 
    roleLoading,
    messagingSupported
  });

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      role, 
      roleLoading,
      messagingSupported, 
      setUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);