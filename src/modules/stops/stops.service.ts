import { Injectable, Logger } from '@nestjs/common';
import { Region } from '@prisma/client';
import {
  BusProvider,
  StationDto,
  RouteDto,
  ArrivalInfoDto,
} from '../../providers/bus-provider.interface';
import { GyeonggiProvider } from '../../providers/gyeonggi/gyeonggi.provider';
import { SeoulProvider } from '../../providers/seoul/seoul.provider';

@Injectable()
export class StopsService {
  private readonly logger = new Logger(StopsService.name);
  private readonly providers: Map<Region, BusProvider>;

  constructor(
    private readonly gyeonggiProvider: GyeonggiProvider,
    private readonly seoulProvider: SeoulProvider,
  ) {
    this.providers = new Map<Region, BusProvider>([
      [Region.GG, this.gyeonggiProvider],
      [Region.SEOUL, this.seoulProvider],
    ]);
  }

  private getProvider(region?: Region): BusProvider {
    if (region && this.providers.has(region)) {
      return this.providers.get(region)!;
    }
    return this.gyeonggiProvider;
  }

  async searchByKeyword(
    keyword: string,
    region?: Region,
  ): Promise<StationDto[]> {
    const provider = this.getProvider(region);
    this.logger.debug(
      `Searching stations by keyword: ${keyword} in region: ${provider.region}`,
    );
    return provider.searchStations(keyword);
  }

  async searchByLocation(
    lat: number,
    lng: number,
    region?: Region,
  ): Promise<StationDto[]> {
    const provider = this.getProvider(region);
    this.logger.debug(
      `Searching stations around (${lat}, ${lng}) in region: ${provider.region}`,
    );
    return provider.getStationsAround(lat, lng);
  }

  async getRoutesByStation(
    stationId: string,
    region?: Region,
  ): Promise<RouteDto[]> {
    const provider = this.getProvider(region);
    this.logger.debug(
      `Getting routes for station: ${stationId} in region: ${provider.region}`,
    );
    return provider.getRoutesByStation(stationId);
  }

  async getArrivalInfo(
    stationId: string,
    region?: Region,
  ): Promise<ArrivalInfoDto[]> {
    const provider = this.getProvider(region);
    this.logger.debug(
      `Getting arrival info for station: ${stationId} in region: ${provider.region}`,
    );
    return provider.getArrivalInfo(stationId);
  }
}
