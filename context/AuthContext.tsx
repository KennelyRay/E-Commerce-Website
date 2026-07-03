'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '@/types';
import toast from 'react-hot-toast';
import { ensureAdminUser, getCurrentUser, getUsers, saveUsers, setCurrentUser } from '@/lib/shop';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const users = ensureAdminUser();
        const savedUser = getCurrentUser();

        if (savedUser) {
          const existingUser = users.find(
            (candidate) => candidate.username.toLowerCase() === savedUser.username.toLowerCase(),
          );

          if (existingUser && !existingUser.isBanned) {
            setUser(existingUser);
            setCurrentUser(existingUser);
          } else {
            setCurrentUser(null);
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
      const normalizedUsername = username.trim().toLowerCase();
      const users = getUsers();
      const foundUser = users.find(
        (candidate) =>
          candidate.username.toLowerCase() === normalizedUsername ||
          candidate.email.toLowerCase() === normalizedUsername,
      );

      if (foundUser && foundUser.password === password) {
        if (foundUser.isBanned) {
          toast.error('Your account has been banned. Please contact support.');
          return false;
        }

        setUser(foundUser);
        setCurrentUser(foundUser);

        if (foundUser.isAdmin) {
          toast.success('Welcome back, Administrator!');
        } else {
          toast.success(`Welcome back, ${foundUser.name}!`);
        }
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
      const trimmedName = name.trim();
      const trimmedUsername = username.trim();
      const normalizedEmail = email.trim().toLowerCase();
      const users = getUsers();

      if (trimmedName.length < 2) {
        toast.error('Please enter your full name.');
        return false;
      }

      if (trimmedUsername.length < 3) {
        toast.error('Username must be at least 3 characters.');
        return false;
      }

      if (password.trim().length < 6) {
        toast.error('Password must be at least 6 characters.');
        return false;
      }

      const existingUserByUsername = users.find(
        (candidate) => candidate.username.toLowerCase() === trimmedUsername.toLowerCase(),
      );
      if (existingUserByUsername) {
        toast.error('Username already exists. Please choose a different username.');
        return false;
      }

      const existingUserByEmail = users.find(
        (candidate) => candidate.email.toLowerCase() === normalizedEmail,
      );
      if (existingUserByEmail) {
        toast.error('Email already exists. Please use a different email.');
        return false;
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        name: trimmedName,
        username: trimmedUsername,
        email: normalizedEmail,
        password,
        isAdmin: false,
        isBanned: false,
        createdAt: new Date().toISOString(),
      };

      saveUsers([...users, newUser]);
      setUser(newUser);
      setCurrentUser(newUser);

      toast.success(`Welcome to VertixHub, ${trimmedName}!`);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
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
