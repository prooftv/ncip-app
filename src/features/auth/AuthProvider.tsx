'use client'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, User, signInAnonymously, signOut as authSignOut } from 'firebase/auth';
import { auth, db } from '@lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

export type UserRole = 'parent' | 'admin' | 'ngo' | 'community' | 'school' | 'guardian';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<UserRole | null>;
}

const AuthContext = createContext<AuthContextType>(null!);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshRole = useCallback(async (): Promise<UserRole | null> => {
    if (!user) return null;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      
      // Add automatic admin detection for foundation emails
      const adminEmails = [
        'admin@unamifoundation.org', 
        'info@unamifoundation.org',
        // Add other admin emails as needed
      ];
      
      let newRole: UserRole = docSnap.exists() 
        ? (docSnap.data().role as UserRole)
        : 'parent';
      
      // Auto-promote foundation emails to admin
      if (user.email && adminEmails.includes(user.email.toLowerCase()) && newRole !== 'admin') {
        newRole = 'admin';
        await setDoc(userRef, { role: 'admin' }, { merge: true });
      }
      
      setRole(newRole);
      return newRole;
    } catch (error) {
      console.error("Failed to refresh role:", error);
      return role;
    }
  }, [user, role]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await refreshRole();
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [refreshRole]);

  const signIn = async () => {
    setLoading(true);
    try {
      const result = await signInAnonymously(auth);
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, { role: 'parent' }, { merge: true });
      setRole('parent');
    } catch (error) {
      toast.error('Sign in failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authSignOut(auth);
    } catch (error) {
      toast.error('Sign out failed');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      loading,
      signIn,
      signOut,
      refreshRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}