import { api } from '../api';
import type { AuthUser, AuthTokens, LoginDto, RegisterDto } from '@busnoti/shared';

export const authApi = {
  login: (dto: LoginDto) => api.post<AuthTokens>('/auth/login', dto),

  register: (dto: RegisterDto) => api.post<AuthTokens>('/auth/register', dto),

  logout: (refreshToken: string) =>
    api.post<void>('/auth/logout', { refreshToken }),

  getMe: () => api.get<AuthUser>('/auth/me'),
};
