import { Injectable } from '@nestjs/common';
import { StationDto, RouteDto, ArrivalInfoDto, Region } from '@busnoti/shared';
import { BusInfoProvider } from '../../providers/busInfoProvider/bus-info.provider';

@Injectable()
export class StopsService {
  constructor(private readonly busInfoProvider: BusInfoProvider) {}

  async searchByKeyword(
    keyword: string,
    region?: Region,
  ): Promise<StationDto[]> {
    return this.busInfoProvider.searchStations(keyword, region ?? Region.GG);
  }

  async searchByLocation(
    lat: number,
    lng: number,
    region?: Region,
  ): Promise<StationDto[]> {
    return this.busInfoProvider.getStationsAround(
      lat,
      lng,
      region ?? Region.GG,
    );
  }

  async getRoutesByStation(
    stationId: string,
    region?: Region,
  ): Promise<RouteDto[]> {
    return this.busInfoProvider.getRoutesByStation(
      stationId,
      region ?? Region.GG,
    );
  }

  async getArrivalInfo(
    stationId: string,
    region?: Region,
  ): Promise<ArrivalInfoDto[]> {
    return this.busInfoProvider.getArrivalInfo(stationId, region ?? Region.GG);
  }
}
