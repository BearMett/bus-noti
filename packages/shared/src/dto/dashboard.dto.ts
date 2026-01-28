import type { Region } from '@prisma/client';

export interface DashboardArrivalDto {
  predictTimeMin: number;
  plateNo: string;
  remainStops?: number;
}

export interface DashboardSubscriptionDto {
  id: string;
  region: Region;
  stationId: string;
  stationName: string;
  routeId: string;
  routeName: string;
  leadTimeMinutes: number;
  isActive: boolean;
  arrival: DashboardArrivalDto | null;
}

export interface DashboardResponseDto {
  subscriptions: DashboardSubscriptionDto[];
  lastUpdated: string;
}
