"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  verifyOTP: (email: string, otp: string, type: string) => Promise<void>;
  sendOTP: (email: string, type: string) => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Get refresh token from localStorage
  const getRefreshToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  };

  // Set tokens
  const setTokens = (token: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    }
  };

  // Clear tokens
  const clearTokens = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  };

  // Fetch current user
  const fetchUser = async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
        setIsSignedIn(true);
      } else if (response.status === 401) {
        // Token expired, try to refresh
        await refreshToken();
      } else {
        clearTokens();
        setUser(null);
        setIsSignedIn(false);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      clearTokens();
      setUser(null);
      setIsSignedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh token
  const refreshToken = async () => {
    const refreshTokenValue = getRefreshToken();
    if (!refreshTokenValue) {
      clearTokens();
      setUser(null);
      setIsSignedIn(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      if (response.ok) {
        const data = await response.json();
        setTokens(data.data.token, data.data.refreshToken);
        setUser(data.data.user);
        setIsSignedIn(true);
      } else {
        clearTokens();
        setUser(null);
        setIsSignedIn(false);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      clearTokens();
      setUser(null);
      setIsSignedIn(false);
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setTokens(data.data.token, data.data.refreshToken);
        setUser(data.data.user);
        setIsSignedIn(true);
        toast.success(data.message || 'Login successful');
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  // Signup
  const signup = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Signup successful! Please check your email for OTP.');
      } else {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    }
  };

  // Verify OTP
  const verifyOTP = async (email: string, otp: string, type: string) => {
    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, type }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.data?.token && data.data?.refreshToken) {
          setTokens(data.data.token, data.data.refreshToken);
          setUser(data.data.user);
          setIsSignedIn(true);
        }
        toast.success(data.message || 'OTP verified successfully');
      } else {
        throw new Error(data.message || 'OTP verification failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'OTP verification failed');
      throw error;
    }
  };

  // Send OTP
  const sendOTP = async (email: string, type: string) => {
    try {
      const response = await fetch(`${API_URL}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, type }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'OTP sent successfully');
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    const token = getToken();
    
    try {
      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      clearTokens();
      setUser(null);
      setIsSignedIn(false);
      toast.success('Logged out successfully');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSignedIn,
        login,
        signup,
        logout,
        verifyOTP,
        sendOTP,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
