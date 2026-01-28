import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  BusProvider,
  StationDto,
  RouteDto,
  ArrivalInfoDto,
  Region,
} from '@busnoti/shared';
import { GyeonggiProvider } from '../gyeonggi/gyeonggi.provider';
import { SeoulProvider } from '../seoul/seoul.provider';

@Injectable()
export class BusInfoProvider {
  private readonly logger = new Logger(BusInfoProvider.name);
  private readonly providers: Map<Region, BusProvider>;

  constructor(
    gyeonggiProvider: GyeonggiProvider,
    seoulProvider: SeoulProvider,
  ) {
    this.providers = new Map<Region, BusProvider>([
      [Region.GG, gyeonggiProvider],
      [Region.SEOUL, seoulProvider],
    ]);
  }

  private getProvider(region: Region): BusProvider {
    const provider = this.providers.get(region);
    if (!provider) {
      throw new NotFoundException(`Unsupported region: ${region}`);
    }
    return provider;
  }

  getSupportedRegions(): Region[] {
    return Array.from(this.providers.keys());
  }

  async searchStations(keyword: string, region: Region): Promise<StationDto[]> {
    this.logger.debug(
      `Searching stations by keyword: ${keyword} in region: ${region}`,
    );
    return this.getProvider(region).searchStations(keyword);
  }

  async getStationsAround(
    lat: number,
    lng: number,
    region: Region,
  ): Promise<StationDto[]> {
    this.logger.debug(
      `Searching stations around (${lat}, ${lng}) in region: ${region}`,
    );
    return this.getProvider(region).getStationsAround(lat, lng);
  }

  async getRoutesByStation(
    stationId: string,
    region: Region,
  ): Promise<RouteDto[]> {
    this.logger.debug(
      `Getting routes for station: ${stationId} in region: ${region}`,
    );
    return this.getProvider(region).getRoutesByStation(stationId);
  }

  async getArrivalInfo(
    stationId: string,
    region: Region,
  ): Promise<ArrivalInfoDto[]> {
    this.logger.debug(
      `Getting arrival info for station: ${stationId} in region: ${region}`,
    );
    return this.getProvider(region).getArrivalInfo(stationId);
  }

  async getArrivalsByRoute(
    stationId: string,
    routeId: string,
    region: Region,
  ): Promise<ArrivalInfoDto[]> {
    this.logger.debug(
      `Getting arrivals for route ${routeId} at station ${stationId} in region: ${region}`,
    );
    const allArrivals = await this.getArrivalInfo(stationId, region);
    return allArrivals.filter(
      (arrival) => String(arrival.routeId) === String(routeId),
    );
  }
}
