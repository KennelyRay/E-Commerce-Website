'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (name: string, username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('vertixhub_current_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('vertixhub_current_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Admin login
      if (username === 'Admin' && password === '12345') {
        const adminUser: User = {
          id: 'admin',
          name: 'Administrator',
          username: 'Admin',
          email: 'admin@vertixhub.com',
          password: '12345',
          isAdmin: true,
          isBanned: false,
          createdAt: new Date().toISOString()
        };
        setUser(adminUser);
        localStorage.setItem('vertixhub_current_user', JSON.stringify(adminUser));
        toast.success('Welcome back, Administrator!');
        return true;
      }

      // Regular user login
      const users = JSON.parse(localStorage.getItem('vertixhub_users') || '[]');
      const foundUser = users.find((u: User) => 
        u.username === username && u.password === password
      );

      if (foundUser) {
        if (foundUser.isBanned) {
          toast.error('Your account has been banned. Please contact support.');
          return false;
        }
        setUser(foundUser);
        localStorage.setItem('vertixhub_current_user', JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
        return true;
      } else {
        toast.error('Invalid username or password');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const register = async (name: string, username: string, email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('vertixhub_users') || '[]');
      
      // Check if username already exists
      if (users.some((u: User) => u.username === username)) {
        toast.error('Username already exists. Please choose a different username.');
        return false;
      }

      // Check if email already exists
      if (users.some((u: User) => u.email === email)) {
        toast.error('Email already exists. Please use a different email.');
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        username,
        email,
        password,
        isAdmin: false,
        isBanned: false,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('vertixhub_users', JSON.stringify(users));
      
      setUser(newUser);
      localStorage.setItem('vertixhub_current_user', JSON.stringify(newUser));
      
      toast.success(`Welcome to VertixHub, ${name}!`);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vertixhub_current_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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