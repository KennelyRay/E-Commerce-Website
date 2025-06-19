'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import toast from 'react-hot-toast';
import { db, ensureDbInitialized } from '@/lib/database';

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
    const initializeAuth = async () => {
      try {
        // Initialize database first
        await ensureDbInitialized();

        // Check for existing user session
        const savedUser = localStorage.getItem('vertixhub_current_user');
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            // Verify user still exists in database
            const dbUser = await db.getUserByUsername(userData.username);
            if (dbUser && !dbUser.isBanned) {
              setUser(dbUser);
            } else {
              // User no longer exists or is banned, clear session
              localStorage.removeItem('vertixhub_current_user');
            }
          } catch (error) {
            console.error('Error parsing saved user data:', error);
            localStorage.removeItem('vertixhub_current_user');
          }
        }
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
        toast.error('Failed to initialize application. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      await ensureDbInitialized();

      // Admin login
      if (username === 'Admin' && password === '12345') {
        const adminUser = await db.getUserByUsername('Admin');
        if (adminUser) {
          setUser(adminUser);
          localStorage.setItem('vertixhub_current_user', JSON.stringify(adminUser));
          toast.success('Welcome back, Administrator!');
          return true;
        }
      }

      // Regular user login
      const foundUser = await db.getUserByUsername(username);

      if (foundUser && foundUser.password === password) {
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
      await ensureDbInitialized();
      
      // Check if username already exists
      const existingUserByUsername = await db.getUserByUsername(username);
      if (existingUserByUsername) {
        toast.error('Username already exists. Please choose a different username.');
        return false;
      }

      // Check if email already exists
      const existingUserByEmail = await db.getUserByEmail(email);
      if (existingUserByEmail) {
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

      await db.insertUser(newUser);
      
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