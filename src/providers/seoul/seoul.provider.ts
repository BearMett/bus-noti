import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { Region } from '@prisma/client';
import {
  BusProvider,
  StationDto,
  RouteDto,
  ArrivalInfoDto,
} from '../bus-provider.interface';

/**
 * Seoul Bus Information API Response Types
 * 서울특별시 버스정보시스템 API
 */
interface SeoulResponseHeader {
  headerCd: string;
  headerMsg: string;
  itemCount?: number;
}

interface SeoulStation {
  stId: string; // 정류소 ID
  stNm: string; // 정류소 이름
  arsId: string; // 정류소 번호
  tmX: string; // 경도 (longitude)
  tmY: string; // 위도 (latitude)
  posX?: string;
  posY?: string;
}

interface SeoulRoute {
  busRouteId: string; // 노선 ID
  busRouteNm: string; // 노선명
  routeType: string; // 노선 유형
  staOrd?: string; // 정류소 순번
  busRouteAbrv?: string; // 노선 약칭
}

interface SeoulArrival {
  busRouteId: string; // 노선 ID
  busRouteNm?: string; // 노선명
  rtNm?: string; // 노선명 (대체 필드)
  arrmsg1: string; // 첫번째 버스 도착 메시지
  exps1?: string; // 첫번째 버스 도착예정시간 (초)
  vehId1?: string; // 첫번째 버스 차량 ID
  plainNo1?: string; // 첫번째 버스 차량번호
  sectOrd?: string; // 정류소 순번
  stId?: string; // 정류소 ID
  stNm?: string; // 정류소 이름
  arrmsg2?: string; // 두번째 버스 도착 메시지
  exps2?: string; // 두번째 버스 도착예정시간 (초)
  vehId2?: string; // 두번째 버스 차량 ID
  plainNo2?: string; // 두번째 버스 차량번호
  traTime1?: string; // 첫번째 버스 이동시간
  traTime2?: string; // 두번째 버스 이동시간
}

interface SeoulApiResponse<T> {
  ServiceResult?: {
    msgHeader: SeoulResponseHeader;
    msgBody?: {
      itemList?: T[];
    };
  };
  // Some endpoints use different wrapper structure
  msgHeader?: SeoulResponseHeader;
  msgBody?: {
    itemList?: T[];
  };
}

@Injectable()
export class SeoulProvider implements BusProvider {
  readonly region = Region.SEOUL;

  private readonly logger = new Logger(SeoulProvider.name);
  private readonly httpClient: AxiosInstance;
  private readonly apiKey: string;
  private readonly baseUrl = 'http://ws.bus.go.kr/api/rest';

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('apiKeys.seoulApiKey', '');

    if (!this.apiKey) {
      this.logger.warn('Seoul API key not configured. API calls will fail.');
    }

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        Accept: 'application/json',
      },
    });
  }

  /**
   * 정류소 검색 (키워드)
   */
  async searchStations(keyword: string): Promise<StationDto[]> {
    try {
      const response = await this.httpClient.get<
        SeoulApiResponse<SeoulStation>
      >('/stationinfo/getStationByName', {
        params: {
          serviceKey: this.apiKey,
          stSrch: keyword,
          resultType: 'json',
        },
      });

      const itemList = this.extractItemList(response.data);
      return itemList.map((station) => this.mapToStationDto(station));
    } catch (error) {
      this.handleApiError('searchStations', error);
      return [];
    }
  }

  /**
   * 주변 정류소 (좌표 기반)
   * Note: Seoul API doesn't have a direct endpoint for this.
   * Returns empty array as per specification.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getStationsAround(_lat: number, _lng: number): Promise<StationDto[]> {
    // Seoul API doesn't provide a direct getStationsAround endpoint
    // If needed, this could be implemented by:
    // 1. Searching with area codes
    // 2. Using a database of stations with coordinates
    // For now, return empty array as specified
    this.logger.debug(
      'getStationsAround is not supported by Seoul API, returning empty array',
    );
    return Promise.resolve([]);
  }

  /**
   * 정류소 경유노선 목록
   */
  async getRoutesByStation(stationId: string): Promise<RouteDto[]> {
    try {
      // Seoul API uses arsId (정류소번호) for this endpoint
      const response = await this.httpClient.get<SeoulApiResponse<SeoulRoute>>(
        '/stationinfo/getRouteByStation',
        {
          params: {
            serviceKey: this.apiKey,
            arsId: stationId,
            resultType: 'json',
          },
        },
      );

      const itemList = this.extractItemList(response.data);
      return itemList.map((route) => this.mapToRouteDto(route));
    } catch (error) {
      this.handleApiError('getRoutesByStation', error);
      return [];
    }
  }

  /**
   * 도착정보 조회 (알림 트리거용)
   * Note: Seoul API gets arrivals by route, then filters by stationId.
   */
  async getArrivalInfo(stationId: string): Promise<ArrivalInfoDto[]> {
    try {
      // First, get routes by station to know which routes to query
      const routes = await this.getRoutesByStation(stationId);

      if (routes.length === 0) {
        return [];
      }

      // Query arrival info for each route and filter by station
      const arrivalPromises = routes.map((route) =>
        this.getArrivalInfoByRoute(route.routeId, stationId),
      );

      const arrivalResults = await Promise.all(arrivalPromises);
      return arrivalResults.flat();
    } catch (error) {
      this.handleApiError('getArrivalInfo', error);
      return [];
    }
  }

  /**
   * Get arrival info for a specific route, filtered by station
   */
  private async getArrivalInfoByRoute(
    busRouteId: string,
    targetStationId: string,
  ): Promise<ArrivalInfoDto[]> {
    try {
      const response = await this.httpClient.get<
        SeoulApiResponse<SeoulArrival>
      >('/arrive/getArrInfoByRouteAll', {
        params: {
          serviceKey: this.apiKey,
          busRouteId,
          resultType: 'json',
        },
      });

      const itemList = this.extractItemList(response.data);

      // Filter by target station (using arsId or stId)
      const filteredArrivals = itemList.filter(
        (arrival) =>
          arrival.stId === targetStationId ||
          arrival.stNm?.includes(targetStationId),
      );

      return this.mapToArrivalDtos(filteredArrivals, busRouteId);
    } catch (error) {
      this.handleApiError(`getArrivalInfoByRoute(${busRouteId})`, error);
      return [];
    }
  }

  /**
   * Extract itemList from Seoul API response (handles different response structures)
   */
  private extractItemList<T>(response: SeoulApiResponse<T>): T[] {
    // Try ServiceResult wrapper first
    if (response.ServiceResult) {
      this.validateResponseHeader(response.ServiceResult.msgHeader);
      return response.ServiceResult.msgBody?.itemList ?? [];
    }

    // Try direct msgBody structure
    if (response.msgHeader) {
      this.validateResponseHeader(response.msgHeader);
      return response.msgBody?.itemList ?? [];
    }

    this.logger.warn('Unknown Seoul API response structure');
    return [];
  }

  /**
   * Validate Seoul API response header
   */
  private validateResponseHeader(header: SeoulResponseHeader): void {
    // Seoul API uses '0' for success, '4' for no data
    if (header.headerCd !== '0' && header.headerCd !== '4') {
      const message = header.headerMsg || 'Unknown error';
      throw new Error(`Seoul API error (${header.headerCd}): ${message}`);
    }
  }

  /**
   * Map Seoul station to StationDto
   */
  private mapToStationDto(station: SeoulStation): StationDto {
    return {
      stationId: station.stId,
      stationName: station.stNm,
      arsId: station.arsId,
      latitude: this.parseCoordinate(station.tmY),
      longitude: this.parseCoordinate(station.tmX),
      region: this.region,
    };
  }

  /**
   * Map Seoul route to RouteDto
   */
  private mapToRouteDto(route: SeoulRoute): RouteDto {
    return {
      routeId: route.busRouteId,
      routeName: route.busRouteNm || route.busRouteAbrv || '',
      routeType: route.routeType,
      region: this.region,
    };
  }

  /**
   * Map Seoul arrival data to ArrivalInfoDto array
   */
  private mapToArrivalDtos(
    arrivals: SeoulArrival[],
    routeId: string,
  ): ArrivalInfoDto[] {
    const result: ArrivalInfoDto[] = [];

    for (const arrival of arrivals) {
      const routeName = arrival.busRouteNm || arrival.rtNm || '';
      const staOrder = this.parseNumber(arrival.sectOrd, 0);

      // First bus
      if (arrival.plainNo1 && arrival.exps1) {
        const predictTimeSec = this.parseNumber(arrival.exps1, 0);
        if (predictTimeSec > 0) {
          result.push({
            routeId: arrival.busRouteId || routeId,
            routeName,
            predictTimeSec,
            predictTimeMin: Math.floor(predictTimeSec / 60),
            plateNo: arrival.plainNo1,
            staOrder,
          });
        }
      }

      // Second bus
      if (arrival.plainNo2 && arrival.exps2) {
        const predictTimeSec = this.parseNumber(arrival.exps2, 0);
        if (predictTimeSec > 0) {
          result.push({
            routeId: arrival.busRouteId || routeId,
            routeName,
            predictTimeSec,
            predictTimeMin: Math.floor(predictTimeSec / 60),
            plateNo: arrival.plainNo2,
            staOrder,
          });
        }
      }
    }

    return result;
  }

  /**
   * Parse coordinate string to number
   */
  private parseCoordinate(value: string | undefined): number | undefined {
    if (!value) return undefined;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  }

  /**
   * Parse string to number with default value
   */
  private parseNumber(value: string | undefined, defaultValue: number): number {
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Handle and log API errors
   */
  private handleApiError(method: string, error: unknown): void {
    if (axios.isAxiosError(error)) {
      this.logger.error(
        `${method} failed: ${error.message}`,
        error.response?.data,
      );
    } else if (error instanceof Error) {
      this.logger.error(`${method} failed: ${error.message}`);
    } else {
      this.logger.error(`${method} failed with unknown error`);
    }
  }
}
