import type { Region } from '@prisma/client';

export interface StationDto {
  stationId: string;
  stationName: string;
  arsId?: string;
  latitude?: number;
  longitude?: number;
  region: Region;
}

export interface RouteDto {
  routeId: string;
  routeName: string;
  routeType?: string;
  region: Region;
}

export interface ArrivalInfoDto {
  routeId: string;
  routeName: string;
  predictTimeSec: number; // 초 단위 도착예측
  predictTimeMin: number; // 분 단위 도착예측
  plateNo: string; // 차량번호 (idempotency key)
  staOrder: number; // 정류소 순번
  remainStops?: number; // 남은 정류소 수
}

export interface BusProvider {
  readonly region: Region;

  // 정류소 검색 (키워드)
  searchStations(keyword: string): Promise<StationDto[]>;

  // 주변 정류소 (좌표 기반)
  getStationsAround(lat: number, lng: number): Promise<StationDto[]>;

  // 정류소 경유노선 목록
  getRoutesByStation(stationId: string): Promise<RouteDto[]>;

  // 도착정보 조회 (알림 트리거용)
  getArrivalInfo(stationId: string): Promise<ArrivalInfoDto[]>;
}
