'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authStorage } from '@/lib/auth';
import { api } from '@/lib/api';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginDto {
  email: string;
  password: string;
}

interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const userData = await api.get<AuthUser>('/auth/me');
      setUser(userData);
    } catch {
      authStorage.clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authStorage.isAuthenticated()) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const login = async (dto: LoginDto) => {
    const tokens = await api.post<AuthTokens>('/auth/login', dto);
    authStorage.setTokens(tokens);
    await fetchUser();
    router.push('/');
  };

  const register = async (dto: RegisterDto) => {
    const tokens = await api.post<AuthTokens>('/auth/register', dto);
    authStorage.setTokens(tokens);
    await fetchUser();
    router.push('/');
  };

  const logout = async () => {
    const refreshToken = authStorage.getRefreshToken();
    if (refreshToken) {
      try {
        await api.post('/auth/logout', { refreshToken });
      } catch {
        // Ignore logout errors
      }
    }
    authStorage.clearTokens();
    setUser(null);
    router.push('/login');
  };

  const handleOAuthCallback = async (
    accessToken: string,
    refreshToken: string,
  ) => {
    authStorage.setTokens({ accessToken, refreshToken });
    await fetchUser();
    router.push('/');
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    handleOAuthCallback,
  };
}
