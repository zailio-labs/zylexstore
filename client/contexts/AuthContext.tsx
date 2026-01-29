"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthAPI from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  isAuthenticated: boolean;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (AuthAPI.isAuthenticated()) {
          const storedUser = AuthAPI.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await AuthAPI.login({ email, password });
    if (response.success && response.data?.user) {
      setUser(response.data.user);
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  const logout = async () => {
    await AuthAPI.logout();
    setUser(null);
    router.push('/');
  };

  const signup = async (name: string, email: string, password: string, confirmPassword: string) => {
    const response = await AuthAPI.signup({ name, email, password, confirmPassword });
    if (!response.success) {
      throw new Error(response.message || 'Signup failed');
    }
  };

  const refetchUser = async () => {
    try {
      const response = await AuthAPI.getMe();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Error refetching user:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    isAuthenticated: !!user,
    refetchUser,
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
