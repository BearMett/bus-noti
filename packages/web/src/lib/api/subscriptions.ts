import { api } from '../api';
import type {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  Subscription,
  DashboardResponseDto,
} from '@busnoti/shared';

export const subscriptionsApi = {
  list: () => api.get<Subscription[]>('/subscriptions'),

  get: (id: string) => api.get<Subscription>(`/subscriptions/${id}`),

  create: (dto: Omit<CreateSubscriptionDto, 'userId'>) =>
    api.post<Subscription>('/subscriptions', dto),

  update: (id: string, dto: UpdateSubscriptionDto) =>
    api.patch<Subscription>(`/subscriptions/${id}`, dto),

  delete: (id: string) => api.delete(`/subscriptions/${id}`),

  getDashboard: () => api.get<DashboardResponseDto>('/subscriptions/dashboard'),
};
