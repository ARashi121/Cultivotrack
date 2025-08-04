"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase';
import type { User, AuthContextType, UserRole } from '@/lib/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real app, this would be managed in a database.
const ADMIN_EMAIL = "admin@cultivotrack.com";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        // Determine role based on email
        const role: UserRole = user.email === ADMIN_EMAIL ? 'admin' : 'technician';
        setUser({
          uid: user.uid,
          email: user.email,
          role: role,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const signup = (email: string, password: string): Promise<void> => {
    return createUserWithEmailAndPassword(auth, email, password).then(() => {});
  };

  const login = (email: string, password: string): Promise<void> => {
     return signInWithEmailAndPassword(auth, email, password).then(() => {});
  };

  const logout = (): Promise<void> => {
    return signOut(auth);
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
