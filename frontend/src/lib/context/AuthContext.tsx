'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as authLib from '@/lib/auth';

interface AuthContextValue {
  isAuthenticated: boolean | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAuthenticated(authLib.isLoggedIn());
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await authLib.login(email, password);
    setIsAuthenticated(true);
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    await authLib.signup(email, password);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    authLib.logout();
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}