'use client';

import { useQuery } from '@tanstack/react-query';
import { stopsApi } from '@/lib/api/stops';

export const stopKeys = {
  search: (keyword: string) => ['stops', 'search', keyword] as const,
  routes: (stationId: string) => ['stops', stationId, 'routes'] as const,
  arrivals: (stationId: string) => ['stops', stationId, 'arrivals'] as const,
};

export function useStopSearch(keyword: string) {
  return useQuery({
    queryKey: stopKeys.search(keyword),
    queryFn: () => stopsApi.search(keyword),
    enabled: keyword.length >= 2,
    staleTime: 5 * 60 * 1000, // 5분 - 정류소 정보는 자주 변하지 않음
  });
}

export function useStopRoutes(stationId: string) {
  return useQuery({
    queryKey: stopKeys.routes(stationId),
    queryFn: () => stopsApi.getRoutes(stationId),
    enabled: !!stationId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useStopArrivals(
  stationId: string,
  options?: { refetchInterval?: number },
) {
  return useQuery({
    queryKey: stopKeys.arrivals(stationId),
    queryFn: () => stopsApi.getArrivals(stationId),
    enabled: !!stationId,
    refetchInterval: options?.refetchInterval ?? 30000, // 기본 30초 폴링
    staleTime: 10 * 1000, // 10초 - 도착정보는 자주 변함
  });
}
