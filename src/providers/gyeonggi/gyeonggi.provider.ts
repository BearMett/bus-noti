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
 * GBIS (경기도 버스정보시스템) API Response Types
 */
interface GbisResponseHeader {
  queryTime: string;
  resultCode: string;
  resultMessage: string;
}

interface GbisStation {
  stationId: string;
  stationName: string;
  x: number; // longitude
  y: number; // latitude
  centerYn?: string;
  districtCd?: string;
  mobileNo?: string;
  regionName?: string;
}

interface GbisRoute {
  routeId: string;
  routeName: string;
  routeTypeCd: string;
  routeTypeName?: string;
  staOrder?: number;
}

interface GbisArrival {
  routeId: string;
  routeName: string;
  predictTime1?: number; // 첫번째 버스 도착예정시간 (분)
  predictTimeSec1?: number; // 첫번째 버스 도착예정시간 (초)
  plateNo1?: string; // 첫번째 버스 차량번호
  remainSeatCnt1?: number;
  staOrder?: number;
  predictTime2?: number; // 두번째 버스 도착예정시간 (분)
  predictTimeSec2?: number; // 두번째 버스 도착예정시간 (초)
  plateNo2?: string; // 두번째 버스 차량번호
  remainSeatCnt2?: number;
}

interface GbisApiResponse<T> {
  response: {
    msgHeader: GbisResponseHeader;
    msgBody?: T;
  };
}

interface StationListBody {
  busStationList?: GbisStation | GbisStation[];
}

interface RouteListBody {
  busRouteList?: GbisRoute | GbisRoute[];
}

interface ArrivalListBody {
  busArrivalList?: GbisArrival | GbisArrival[];
}

@Injectable()
export class GyeonggiProvider implements BusProvider {
  readonly region = Region.GG;

  private readonly logger = new Logger(GyeonggiProvider.name);
  private readonly httpClient: AxiosInstance;
  private readonly apiKey: string;
  private readonly baseUrl = 'https://apis.data.go.kr/6410000';

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('apiKeys.gyeonggiApiKey', '');

    if (!this.apiKey) {
      this.logger.warn('Gyeonggi API key not configured. API calls will fail.');
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
        GbisApiResponse<StationListBody>
      >('/busstationservice/v2/getBusStationListv2', {
        params: {
          serviceKey: this.apiKey,
          keyword,
          format: 'json',
        },
      });

      this.validateResponse(response.data);

      const stationList = response.data.response.msgBody?.busStationList;
      const stations = this.ensureArray(stationList);

      return stations.map((station) => this.mapToStationDto(station));
    } catch (error) {
      this.handleApiError('searchStations', error);
      return [];
    }
  }

  /**
   * 주변 정류소 (좌표 기반)
   */
  async getStationsAround(lat: number, lng: number): Promise<StationDto[]> {
    try {
      const response = await this.httpClient.get<
        GbisApiResponse<StationListBody>
      >('/busstationservice/v2/getBusStationAroundListv2', {
        params: {
          serviceKey: this.apiKey,
          x: lng, // GBIS uses x for longitude
          y: lat, // GBIS uses y for latitude
          format: 'json',
        },
      });

      this.validateResponse(response.data);

      const stationList = response.data.response.msgBody?.busStationList;
      const stations = this.ensureArray(stationList);

      return stations.map((station) => this.mapToStationDto(station));
    } catch (error) {
      this.handleApiError('getStationsAround', error);
      return [];
    }
  }

  /**
   * 정류소 경유노선 목록
   */
  async getRoutesByStation(stationId: string): Promise<RouteDto[]> {
    try {
      const response = await this.httpClient.get<
        GbisApiResponse<RouteListBody>
      >('/busstationservice/v2/getBusStationViaRouteListv2', {
        params: {
          serviceKey: this.apiKey,
          stationId,
          format: 'json',
        },
      });

      this.validateResponse(response.data);

      const routeList = response.data.response.msgBody?.busRouteList;
      const routes = this.ensureArray(routeList);

      return routes.map((route) => this.mapToRouteDto(route));
    } catch (error) {
      this.handleApiError('getRoutesByStation', error);
      return [];
    }
  }

  /**
   * 도착정보 조회 (알림 트리거용)
   */
  async getArrivalInfo(stationId: string): Promise<ArrivalInfoDto[]> {
    try {
      const response = await this.httpClient.get<
        GbisApiResponse<ArrivalListBody>
      >('/busarrivalservice/v2/getBusArrivalListv2', {
        params: {
          serviceKey: this.apiKey,
          stationId,
          format: 'json',
        },
      });

      this.validateResponse(response.data);

      const arrivalList = response.data.response.msgBody?.busArrivalList;
      const arrivals = this.ensureArray(arrivalList);

      return this.mapToArrivalDtos(arrivals);
    } catch (error) {
      this.handleApiError('getArrivalInfo', error);
      return [];
    }
  }

  /**
   * Map GBIS station to StationDto
   */
  private mapToStationDto(station: GbisStation): StationDto {
    return {
      stationId: station.stationId,
      stationName: station.stationName,
      arsId: station.mobileNo,
      latitude: station.y, // y is latitude
      longitude: station.x, // x is longitude
      region: this.region,
    };
  }

  /**
   * Map GBIS route to RouteDto
   */
  private mapToRouteDto(route: GbisRoute): RouteDto {
    return {
      routeId: route.routeId,
      routeName: route.routeName,
      routeType: route.routeTypeCd,
      region: this.region,
    };
  }

  /**
   * Map GBIS arrival data to ArrivalInfoDto array
   * Returns entries for both bus1 and bus2 if available
   */
  private mapToArrivalDtos(arrivals: GbisArrival[]): ArrivalInfoDto[] {
    const result: ArrivalInfoDto[] = [];

    for (const arrival of arrivals) {
      // First bus (bus1)
      if (arrival.plateNo1 && arrival.predictTimeSec1 != null) {
        result.push({
          routeId: arrival.routeId,
          routeName: arrival.routeName,
          predictTimeSec: arrival.predictTimeSec1,
          predictTimeMin:
            arrival.predictTime1 ?? Math.floor(arrival.predictTimeSec1 / 60),
          plateNo: arrival.plateNo1,
          staOrder: arrival.staOrder ?? 0,
        });
      }

      // Second bus (bus2)
      if (arrival.plateNo2 && arrival.predictTimeSec2 != null) {
        result.push({
          routeId: arrival.routeId,
          routeName: arrival.routeName,
          predictTimeSec: arrival.predictTimeSec2,
          predictTimeMin:
            arrival.predictTime2 ?? Math.floor(arrival.predictTimeSec2 / 60),
          plateNo: arrival.plateNo2,
          staOrder: arrival.staOrder ?? 0,
        });
      }
    }

    return result;
  }

  /**
   * Ensure data is always an array (GBIS returns single object when only one result)
   */
  private ensureArray<T>(data: T | T[] | undefined): T[] {
    if (!data) {
      return [];
    }
    return Array.isArray(data) ? data : [data];
  }

  /**
   * Validate GBIS API response
   */
  private validateResponse<T>(response: GbisApiResponse<T>): void {
    const resultCode = response?.response?.msgHeader?.resultCode;

    if (!response?.response?.msgHeader) {
      throw new Error('Invalid GBIS API response format');
    }

    // GBIS uses "0" for success, "4" for no results (may be string or number)
    const code = String(resultCode);
    if (code !== '0' && code !== '4') {
      const message =
        response.response.msgHeader.resultMessage || 'Unknown error';
      throw new Error(`GBIS API error (${resultCode}): ${message}`);
    }
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
