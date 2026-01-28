'use client';

import { useQuery } from '@tanstack/react-query';
import { subscriptionsApi } from '@/lib/api/subscriptions';

export const dashboardKeys = {
  all: ['dashboard'] as const,
};

interface UseDashboardOptions {
  refetchInterval?: number;
  enabled?: boolean;
}

export function useDashboard(options?: UseDashboardOptions) {
  const { refetchInterval = 30000, enabled = true } = options ?? {};

  return useQuery({
    queryKey: dashboardKeys.all,
    queryFn: subscriptionsApi.getDashboard,
    refetchInterval,
    enabled,
  });
}
