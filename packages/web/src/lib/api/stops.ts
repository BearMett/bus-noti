import { api } from '../api';
import type { StationDto, RouteDto, ArrivalInfoDto } from '@busnoti/shared';

export const stopsApi = {
  search: (keyword: string) =>
    api.get<StationDto[]>(`/stops?keyword=${encodeURIComponent(keyword)}`),

  getRoutes: (stationId: string) =>
    api.get<RouteDto[]>(`/stops/${stationId}/routes`),

  getArrivals: (stationId: string) =>
    api.get<ArrivalInfoDto[]>(`/stops/${stationId}/arrivals`),
};
