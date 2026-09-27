'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { api, ApiError, errorMessage, getToken, setToken } from '@/lib/api';
import { AuthContextType, AuthResult, User } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type SessionResponse = { token: string; user: User };

function failure(error: unknown): AuthResult {
  return { ok: false, message: errorMessage(error), field: error instanceof ApiError ? error.field : undefined };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setIsLoading(false);
      return;
    }

    api<{ user: User }>('/auth/me')
      .then(({ user: current }) => setUser(current))
      .catch((error) => {
        // 401/403 already cleared the token. Anything else (offline) keeps it for the next visit.
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          setToken(null);
          if (error.status === 403) toast.error(error.message);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const startSession = useCallback((session: SessionResponse) => {
    setToken(session.token);
    setUser(session.user);
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<AuthResult> => {
      try {
        const session = await api<SessionResponse>('/auth/login', { method: 'POST', body: { username, password }, auth: false });
        startSession(session);
        toast.success(session.user.isAdmin ? 'Signed in as administrator' : `Welcome back, ${session.user.name}`);
        return { ok: true };
      } catch (error) {
        return failure(error);
      }
    },
    [startSession],
  );

  const register = useCallback(
    async (name: string, username: string, email: string, password: string): Promise<AuthResult> => {
      try {
        const session = await api<SessionResponse>('/auth/register', { method: 'POST', body: { name, username, email, password }, auth: false });
        startSession(session);
        toast.success(`Account created. Welcome, ${session.user.name}.`);
        return { ok: true };
      } catch (error) {
        return failure(error);
      }
    },
    [startSession],
  );

  const logout = useCallback(async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch {
      // The local sign-out below still happens; an orphaned session expires on its own.
    }
    setToken(null);
    setUser(null);
    toast.success('Signed out');
  }, []);

  const value = useMemo(() => ({ user, isLoading, login, register, logout }), [user, isLoading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
