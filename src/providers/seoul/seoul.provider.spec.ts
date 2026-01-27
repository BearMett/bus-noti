/* eslint-disable @typescript-eslint/unbound-method */
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SeoulProvider } from './seoul.provider';
import { Region } from '@prisma/client';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SeoulProvider', () => {
  let provider: SeoulProvider;
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

    provider = new SeoulProvider(mockConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('region', () => {
    it('should return SEOUL region', () => {
      expect(provider.region).toBe(Region.SEOUL);
    });
  });

  describe('searchStations', () => {
    it('should return stations with ServiceResult wrapper', async () => {
      const mockResponse = {
        data: {
          ServiceResult: {
            msgHeader: { headerCd: '0', headerMsg: 'success' },
            msgBody: {
              itemList: [
                {
                  stId: 'ST001',
                  stNm: '강남역',
                  arsId: '22341',
                  tmX: '127.0276',
                  tmY: '37.4979',
                },
                {
                  stId: 'ST002',
                  stNm: '강남역2번출구',
                  arsId: '22342',
                  tmX: '127.0286',
                  tmY: '37.4989',
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
        region: Region.SEOUL,
      });
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/stationinfo/getStationByName',
        {
          params: {
            serviceKey: 'test-api-key',
            stSrch: '강남',
            resultType: 'json',
          },
        },
      );
    });

    it('should handle direct msgBody wrapper', async () => {
      const mockResponse = {
        data: {
          msgHeader: { headerCd: '0', headerMsg: 'success' },
          msgBody: {
            itemList: [
              {
                stId: 'ST001',
                stNm: '강남역',
                arsId: '22341',
                tmX: '127.0276',
                tmY: '37.4979',
              },
            ],
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await provider.searchStations('강남');

      expect(result).toHaveLength(1);
      expect(result[0].stationId).toBe('ST001');
    });

    it('should return empty array when no results (code 4)', async () => {
      const mockResponse = {
        data: {
          ServiceResult: {
            msgHeader: { headerCd: '4', headerMsg: '결과 없음' },
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
    it('should return empty array (not supported)', async () => {
      const result = await provider.getStationsAround(37.4979, 127.0276);

      expect(result).toEqual([]);
      expect(mockHttpClient.get).not.toHaveBeenCalled();
    });
  });

  describe('getRoutesByStation', () => {
    it('should return routes for a station', async () => {
      const mockResponse = {
        data: {
          ServiceResult: {
            msgHeader: { headerCd: '0' },
            msgBody: {
              itemList: [
                {
                  busRouteId: 'RT001',
                  busRouteNm: '146',
                  routeType: '3',
                },
                {
                  busRouteId: 'RT002',
                  busRouteNm: '360',
                  routeType: '3',
                },
              ],
            },
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await provider.getRoutesByStation('22341');

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        routeId: 'RT001',
        routeName: '146',
        routeType: '3',
        region: Region.SEOUL,
      });
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/stationinfo/getRouteByStation',
        {
          params: {
            serviceKey: 'test-api-key',
            arsId: '22341',
            resultType: 'json',
          },
        },
      );
    });

    it('should use busRouteAbrv when busRouteNm is missing', async () => {
      const mockResponse = {
        data: {
          ServiceResult: {
            msgHeader: { headerCd: '0' },
            msgBody: {
              itemList: [
                {
                  busRouteId: 'RT001',
                  busRouteAbrv: '146A',
                  routeType: '3',
                },
              ],
            },
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await provider.getRoutesByStation('22341');

      expect(result[0].routeName).toBe('146A');
    });
  });

  describe('getArrivalInfo', () => {
    it('should return arrival info by querying each route', async () => {
      // First call: getRoutesByStation
      const routesResponse = {
        data: {
          ServiceResult: {
            msgHeader: { headerCd: '0' },
            msgBody: {
              itemList: [
                { busRouteId: 'RT001', busRouteNm: '146', routeType: '3' },
              ],
            },
          },
        },
      };

      // Second call: getArrInfoByRouteAll
      const arrivalResponse = {
        data: {
          ServiceResult: {
            msgHeader: { headerCd: '0' },
            msgBody: {
              itemList: [
                {
                  busRouteId: 'RT001',
                  busRouteNm: '146',
                  stId: '22341',
                  stNm: '강남역',
                  exps1: '300',
                  plainNo1: '서울70사1234',
                  exps2: '720',
                  plainNo2: '서울70사5678',
                  sectOrd: '10',
                },
                {
                  busRouteId: 'RT001',
                  busRouteNm: '146',
                  stId: '22342', // different station
                  stNm: '다른정류소',
                  exps1: '180',
                  plainNo1: '서울70사9999',
                },
              ],
            },
          },
        },
      };

      mockHttpClient.get
        .mockResolvedValueOnce(routesResponse)
        .mockResolvedValueOnce(arrivalResponse);

      const result = await provider.getArrivalInfo('22341');

      // Should only include arrivals for station 22341
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        routeId: 'RT001',
        routeName: '146',
        predictTimeSec: 300,
        predictTimeMin: 5,
        plateNo: '서울70사1234',
        staOrder: 10,
      });
      expect(result[1]).toEqual({
        routeId: 'RT001',
        routeName: '146',
        predictTimeSec: 720,
        predictTimeMin: 12,
        plateNo: '서울70사5678',
        staOrder: 10,
      });
    });

    it('should return empty array when no routes found', async () => {
      const routesResponse = {
        data: {
          ServiceResult: {
            msgHeader: { headerCd: '4' },
            msgBody: {},
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(routesResponse);

      const result = await provider.getArrivalInfo('22341');

      expect(result).toEqual([]);
    });

    it('should skip arrivals with zero or invalid predictTimeSec', async () => {
      const routesResponse = {
        data: {
          ServiceResult: {
            msgHeader: { headerCd: '0' },
            msgBody: {
              itemList: [
                { busRouteId: 'RT001', busRouteNm: '146', routeType: '3' },
              ],
            },
          },
        },
      };

      const arrivalResponse = {
        data: {
          ServiceResult: {
            msgHeader: { headerCd: '0' },
            msgBody: {
              itemList: [
                {
                  busRouteId: 'RT001',
                  stId: '22341',
                  exps1: '0', // zero should be skipped
                  plainNo1: '서울70사1234',
                  exps2: '300',
                  plainNo2: '서울70사5678',
                },
              ],
            },
          },
        },
      };

      mockHttpClient.get
        .mockResolvedValueOnce(routesResponse)
        .mockResolvedValueOnce(arrivalResponse);

      const result = await provider.getArrivalInfo('22341');

      expect(result).toHaveLength(1);
      expect(result[0].plateNo).toBe('서울70사5678');
    });

    it('should use rtNm when busRouteNm is not available', async () => {
      const routesResponse = {
        data: {
          ServiceResult: {
            msgHeader: { headerCd: '0' },
            msgBody: {
              itemList: [
                { busRouteId: 'RT001', busRouteNm: '146', routeType: '3' },
              ],
            },
          },
        },
      };

      const arrivalResponse = {
        data: {
          ServiceResult: {
            msgHeader: { headerCd: '0' },
            msgBody: {
              itemList: [
                {
                  busRouteId: 'RT001',
                  rtNm: '146번', // alternative field
                  stId: '22341',
                  exps1: '300',
                  plainNo1: '서울70사1234',
                },
              ],
            },
          },
        },
      };

      mockHttpClient.get
        .mockResolvedValueOnce(routesResponse)
        .mockResolvedValueOnce(arrivalResponse);

      const result = await provider.getArrivalInfo('22341');

      expect(result[0].routeName).toBe('146번');
    });
  });

  describe('error handling', () => {
    it('should handle unknown response structure', async () => {
      const mockResponse = {
        data: {}, // no ServiceResult or msgHeader
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await provider.searchStations('강남');

      expect(result).toEqual([]);
    });

    it('should handle API error code', async () => {
      const mockResponse = {
        data: {
          ServiceResult: {
            msgHeader: { headerCd: '99', headerMsg: '서버 오류' },
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

    it('should handle partial route query failures', async () => {
      const routesResponse = {
        data: {
          ServiceResult: {
            msgHeader: { headerCd: '0' },
            msgBody: {
              itemList: [
                { busRouteId: 'RT001', busRouteNm: '146', routeType: '3' },
                { busRouteId: 'RT002', busRouteNm: '360', routeType: '3' },
              ],
            },
          },
        },
      };

      const arrival1Response = {
        data: {
          ServiceResult: {
            msgHeader: { headerCd: '0' },
            msgBody: {
              itemList: [
                {
                  busRouteId: 'RT001',
                  stId: '22341',
                  exps1: '300',
                  plainNo1: '서울70사1234',
                },
              ],
            },
          },
        },
      };

      mockHttpClient.get
        .mockResolvedValueOnce(routesResponse)
        .mockResolvedValueOnce(arrival1Response)
        .mockRejectedValueOnce(new Error('Route RT002 failed'));

      const result = await provider.getArrivalInfo('22341');

      // Should still return results from successful query
      expect(result).toHaveLength(1);
      expect(result[0].routeId).toBe('RT001');
    });
  });

  describe('coordinate parsing', () => {
    it('should handle undefined coordinates', async () => {
      const mockResponse = {
        data: {
          ServiceResult: {
            msgHeader: { headerCd: '0' },
            msgBody: {
              itemList: [
                {
                  stId: 'ST001',
                  stNm: '강남역',
                  arsId: '22341',
                  // tmX and tmY missing
                },
              ],
            },
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await provider.searchStations('강남');

      expect(result[0].latitude).toBeUndefined();
      expect(result[0].longitude).toBeUndefined();
    });

    it('should handle invalid coordinate values', async () => {
      const mockResponse = {
        data: {
          ServiceResult: {
            msgHeader: { headerCd: '0' },
            msgBody: {
              itemList: [
                {
                  stId: 'ST001',
                  stNm: '강남역',
                  arsId: '22341',
                  tmX: 'invalid',
                  tmY: 'NaN',
                },
              ],
            },
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await provider.searchStations('강남');

      expect(result[0].latitude).toBeUndefined();
      expect(result[0].longitude).toBeUndefined();
    });
  });
});
