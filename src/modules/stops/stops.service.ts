import { Injectable, Inject, Logger } from '@nestjs/common';
import { Region } from '../../domain';
import {
  BusProvider,
  StationDto,
  RouteDto,
  ArrivalInfoDto,
} from '../../providers';
import { GyeonggiProvider } from '../../providers/gyeonggi';

@Injectable()
export class StopsService {
  private readonly logger = new Logger(StopsService.name);
  private readonly providers: Map<Region, BusProvider>;

  constructor(
    @Inject(GyeonggiProvider)
    private readonly gyeonggiProvider: GyeonggiProvider,
  ) {
    // Register providers by region
    this.providers = new Map<Region, BusProvider>();
    this.providers.set(Region.GG, this.gyeonggiProvider);
  }

  /**
   * Get the appropriate provider for a region
   * Defaults to Gyeonggi if region is not specified or not implemented
   */
  private getProvider(region?: Region): BusProvider {
    if (region && this.providers.has(region)) {
      return this.providers.get(region)!;
    }
    // Default to Gyeonggi since Seoul is not implemented yet
    return this.gyeonggiProvider;
  }

  /**
   * Search stations by keyword
   */
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

  /**
   * Search nearby stations by location
   */
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

  /**
   * Get routes passing through a station
   */
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

  /**
   * Get arrival information for a station
   */
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
