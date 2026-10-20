'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthResponseData, AuthUser, LoginInput, SignupInput } from '@/shared';
import { apiRequest, setStoredToken, getStoredToken } from '../lib/api';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginInput) => Promise<AuthUser>;
  signup: (data: SignupInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const stored = getStoredToken();
      if (!stored) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setToken(stored);
      const res = await apiRequest<{ user: AuthUser }>('/auth/me');
      setUser(res.data.user);
    } catch {
      // Token is invalid or expired
      setUser(null);
      setToken(null);
      setStoredToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: LoginInput): Promise<AuthUser> => {
    const res = await apiRequest<AuthResponseData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const receivedUser = res.data.user;
    const receivedToken = res.data.token || null;

    setUser(receivedUser);
    setToken(receivedToken);
    setStoredToken(receivedToken);

    return receivedUser;
  };

  const signup = async (data: SignupInput): Promise<AuthUser> => {
    const res = await apiRequest<AuthResponseData>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const receivedUser = res.data.user;
    const receivedToken = res.data.token || null;

    setUser(receivedUser);
    setToken(receivedToken);
    setStoredToken(receivedToken);

    return receivedUser;
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
      // Continue cleanup on client regardless
    } finally {
      setUser(null);
      setToken(null);
      setStoredToken(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
