'use client';

import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { User } from '@/types';
import { authAPI, apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: { name: string; email: string; password: string; phone?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContextInstance = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      apiClient.setAuthToken(token);
      const response = await authAPI.checkAuth();
      
      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('auth_token');
        apiClient.removeAuthToken();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('auth_token');
      apiClient.removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password });
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        localStorage.setItem('auth_token', token);
        apiClient.setAuthToken(token);
        setUser(user);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return true;
      } else {
        toast.error(response.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: { name: string; email: string; password: string; phone?: string }): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authAPI.signup(userData);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        localStorage.setItem('auth_token', token);
        apiClient.setAuthToken(token);
        setUser(user);
        setIsAuthenticated(true);
        toast.success('Account created successfully!');
        return true;
      } else {
        toast.error(response.message || 'Signup failed');
        return false;
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast.error(error.message || 'Signup failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('auth_token');
      apiClient.removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    checkAuth,
  };

  return React.createElement(AuthContextInstance.Provider, { value }, children);
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContextInstance);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;