import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GyeonggiProvider } from './gyeonggi.provider';
import { Region } from '@prisma/client';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GyeonggiProvider', () => {
  let provider: GyeonggiProvider;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockHttpClient: jest.Mocked<ReturnType<typeof axios.create>>;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn().mockReturnValue('test-api-key'),
    } as unknown as jest.Mocked<ConfigService>;

    mockHttpClient = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ReturnType<typeof axios.create>>;

    mockedAxios.create.mockReturnValue(mockHttpClient);

    provider = new GyeonggiProvider(mockConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('region', () => {
    it('should return GG region', () => {
      expect(provider.region).toBe(Region.GG);
    });
  });

  describe('searchStations', () => {
    it('should return stations when API returns array', async () => {
      const mockResponse = {
        data: {
          response: {
            msgHeader: { resultCode: '0', resultMessage: 'success' },
            msgBody: {
              busStationList: [
                {
                  stationId: 'ST001',
                  stationName: '강남역',
                  x: 127.0276,
                  y: 37.4979,
                  mobileNo: '22341',
                },
                {
                  stationId: 'ST002',
                  stationName: '강남역2번출구',
                  x: 127.0286,
                  y: 37.4989,
                  mobileNo: '22342',
                },
              ],
            },
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await provider.searchStations('강남');

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        stationId: 'ST001',
        stationName: '강남역',
        arsId: '22341',
        latitude: 37.4979,
        longitude: 127.0276,
        region: Region.GG,
      });
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/busstationservice/v2/getBusStationListv2',
        {
          params: {
            serviceKey: 'test-api-key',
            keyword: '강남',
            format: 'json',
          },
        },
      );
    });

    it('should handle single station (non-array) response', async () => {
      const mockResponse = {
        data: {
          response: {
            msgHeader: { resultCode: '0', resultMessage: 'success' },
            msgBody: {
              busStationList: {
                stationId: 'ST001',
                stationName: '강남역',
                x: 127.0276,
                y: 37.4979,
              },
            },
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await provider.searchStations('강남역');

      expect(result).toHaveLength(1);
      expect(result[0].stationId).toBe('ST001');
    });

    it('should return empty array when no results (code 4)', async () => {
      const mockResponse = {
        data: {
          response: {
            msgHeader: { resultCode: '4', resultMessage: '결과 없음' },
            msgBody: {},
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await provider.searchStations('존재하지않는정류소');

      expect(result).toEqual([]);
    });

    it('should return empty array on API error', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Network error'));

      const result = await provider.searchStations('강남');

      expect(result).toEqual([]);
    });
  });

  describe('getStationsAround', () => {
    it('should return stations around coordinates', async () => {
      const mockResponse = {
        data: {
          response: {
            msgHeader: { resultCode: '0' },
            msgBody: {
              busStationList: [
                {
                  stationId: 'ST001',
                  stationName: '주변정류소',
                  x: 127.0276,
                  y: 37.4979,
                },
              ],
            },
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await provider.getStationsAround(37.4979, 127.0276);

      expect(result).toHaveLength(1);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/busstationservice/v2/getBusStationAroundListv2',
        {
          params: {
            serviceKey: 'test-api-key',
            x: 127.0276, // longitude
            y: 37.4979, // latitude
            format: 'json',
          },
        },
      );
    });
  });

  describe('getRoutesByStation', () => {
    it('should return routes for a station', async () => {
      const mockResponse = {
        data: {
          response: {
            msgHeader: { resultCode: '0' },
            msgBody: {
              busRouteList: [
                {
                  routeId: 'RT001',
                  routeName: '9003',
                  routeTypeCd: '11',
                },
                {
                  routeId: 'RT002',
                  routeName: '3100',
                  routeTypeCd: '12',
                },
              ],
            },
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await provider.getRoutesByStation('ST001');

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        routeId: 'RT001',
        routeName: '9003',
        routeType: '11',
        region: Region.GG,
      });
    });
  });

  describe('getArrivalInfo', () => {
    it('should return arrival info for both buses', async () => {
      const mockResponse = {
        data: {
          response: {
            msgHeader: { resultCode: '0' },
            msgBody: {
              busArrivalList: [
                {
                  routeId: 'RT001',
                  routeName: '9003',
                  predictTime1: 5,
                  predictTimeSec1: 300,
                  plateNo1: '경기70바1234',
                  staOrder: 10,
                  predictTime2: 12,
                  predictTimeSec2: 720,
                  plateNo2: '경기70바5678',
                },
              ],
            },
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await provider.getArrivalInfo('ST001');

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        routeId: 'RT001',
        routeName: '9003',
        predictTimeSec: 300,
        predictTimeMin: 5,
        plateNo: '경기70바1234',
        staOrder: 10,
      });
      expect(result[1]).toEqual({
        routeId: 'RT001',
        routeName: '9003',
        predictTimeSec: 720,
        predictTimeMin: 12,
        plateNo: '경기70바5678',
        staOrder: 10,
      });
    });

    it('should handle only first bus available', async () => {
      const mockResponse = {
        data: {
          response: {
            msgHeader: { resultCode: '0' },
            msgBody: {
              busArrivalList: [
                {
                  routeId: 'RT001',
                  routeName: '9003',
                  predictTime1: 5,
                  predictTimeSec1: 300,
                  plateNo1: '경기70바1234',
                  staOrder: 10,
                  // no bus2 data
                },
              ],
            },
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await provider.getArrivalInfo('ST001');

      expect(result).toHaveLength(1);
      expect(result[0].plateNo).toBe('경기70바1234');
    });

    it('should calculate predictTimeMin from predictTimeSec when predictTime is missing', async () => {
      const mockResponse = {
        data: {
          response: {
            msgHeader: { resultCode: '0' },
            msgBody: {
              busArrivalList: [
                {
                  routeId: 'RT001',
                  routeName: '9003',
                  predictTimeSec1: 330, // 5.5분 -> 5분
                  plateNo1: '경기70바1234',
                  staOrder: 10,
                },
              ],
            },
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await provider.getArrivalInfo('ST001');

      expect(result[0].predictTimeMin).toBe(5); // Math.floor(330/60)
    });

    it('should return empty array when no buses are arriving', async () => {
      const mockResponse = {
        data: {
          response: {
            msgHeader: { resultCode: '4', resultMessage: '결과 없음' },
            msgBody: {},
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await provider.getArrivalInfo('ST001');

      expect(result).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('should handle invalid response format', async () => {
      const mockResponse = {
        data: {}, // missing response.msgHeader
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await provider.searchStations('강남');

      expect(result).toEqual([]);
    });

    it('should handle API error code', async () => {
      const mockResponse = {
        data: {
          response: {
            msgHeader: { resultCode: '99', resultMessage: '서버 오류' },
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await provider.searchStations('강남');

      expect(result).toEqual([]);
    });

    it('should handle axios error', async () => {
      const axiosError = new Error('Request failed');
      (axiosError as unknown as Record<string, unknown>).isAxiosError = true;
      (axiosError as unknown as Record<string, unknown>).response = {
        data: 'error',
      };
      mockedAxios.isAxiosError.mockReturnValue(true);

      mockHttpClient.get.mockRejectedValue(axiosError);

      const result = await provider.searchStations('강남');

      expect(result).toEqual([]);
    });
  });
});
