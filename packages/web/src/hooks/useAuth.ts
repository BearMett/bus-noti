'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { authStorage } from '@/lib/auth';
import type { LoginDto, RegisterDto } from '@busnoti/shared';

export const authKeys = {
  user: ['auth', 'user'] as const,
};

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: user,
    isLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: authKeys.user,
    queryFn: authApi.getMe,
    enabled: authStorage.isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분
  });

  const loginMutation = useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
    onSuccess: async (tokens) => {
      authStorage.setTokens(tokens);
      await queryClient.invalidateQueries({ queryKey: authKeys.user });
      router.push('/');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (dto: RegisterDto) => authApi.register(dto),
    onSuccess: async (tokens) => {
      authStorage.setTokens(tokens);
      await queryClient.invalidateQueries({ queryKey: authKeys.user });
      router.push('/');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = authStorage.getRefreshToken();
      if (refreshToken) {
        await authApi.logout(refreshToken).catch(() => {
          // 로그아웃 실패해도 로컬 토큰 정리
        });
      }
    },
    onSuccess: () => {
      authStorage.clearTokens();
      queryClient.setQueryData(authKeys.user, null);
      router.push('/login');
    },
  });

  const handleOAuthCallback = async (
    accessToken: string,
    refreshToken: string,
  ) => {
    authStorage.setTokens({ accessToken, refreshToken });
    await queryClient.invalidateQueries({ queryKey: authKeys.user });
    router.push('/');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    registerError: registerMutation.error,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    handleOAuthCallback,
    refetchUser,
  };
}
