'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('vertixhub_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (!parsedUser.isBanned) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('vertixhub_user');
          toast.error('Your account has been banned');
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('vertixhub_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('vertixhub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vertixhub_user');
    }
  }, [user]);

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('vertixhub_users') || '[]');
      
      // Check if user already exists
      if (existingUsers.find((u: User) => u.email === email)) {
        toast.error('User with this email already exists');
        return false;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        isAdmin: false,
        isBanned: false,
        createdAt: new Date().toISOString(),
      };

      // Save user credentials
      const userCredentials = { email, password };
      const existingCredentials = JSON.parse(localStorage.getItem('vertixhub_credentials') || '[]');
      existingCredentials.push(userCredentials);
      localStorage.setItem('vertixhub_credentials', JSON.stringify(existingCredentials));

      // Save user data
      existingUsers.push(newUser);
      localStorage.setItem('vertixhub_users', JSON.stringify(existingUsers));

      setUser(newUser);
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      toast.error('Registration failed');
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check admin credentials
      if (email === 'Admin' && password === '12345') {
        const adminUser: User = {
          id: 'admin',
          name: 'Administrator',
          email: 'admin@vertixhub.com',
          isAdmin: true,
          isBanned: false,
          createdAt: new Date().toISOString(),
        };
        setUser(adminUser);
        toast.success('Welcome back, Administrator!');
        return true;
      }

      // Check user credentials
      const credentials = JSON.parse(localStorage.getItem('vertixhub_credentials') || '[]');
      const userCredential = credentials.find((c: any) => c.email === email && c.password === password);

      if (!userCredential) {
        toast.error('Invalid email or password');
        return false;
      }

      // Get user data
      const users = JSON.parse(localStorage.getItem('vertixhub_users') || '[]');
      const userData = users.find((u: User) => u.email === email);

      if (!userData) {
        toast.error('User account not found');
        return false;
      }

      if (userData.isBanned) {
        toast.error('Your account has been banned');
        return false;
      }

      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      return true;
    } catch (error) {
      toast.error('Login failed');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 