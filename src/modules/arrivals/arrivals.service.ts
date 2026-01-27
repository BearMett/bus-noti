import { Injectable, Logger } from '@nestjs/common';
import { Region } from '../../domain';
import { ArrivalInfoDto } from '../../providers';
import { GyeonggiProvider } from '../../providers/gyeonggi';

/**
 * ArrivalsService handles bus arrival information retrieval.
 * Primarily used by the notification scheduler to check arrival times.
 */
@Injectable()
export class ArrivalsService {
  private readonly logger = new Logger(ArrivalsService.name);

  constructor(private readonly gyeonggiProvider: GyeonggiProvider) {}

  /**
   * Get all arrivals at a station
   * @param stationId - The station ID to query
   * @param region - The region (defaults to Gyeonggi)
   * @returns Array of arrival information for all routes at the station
   */
  async getArrivalsByStation(
    stationId: string,
    region: Region = Region.GG,
  ): Promise<ArrivalInfoDto[]> {
    this.logger.debug(
      `Fetching arrivals for station ${stationId} in region ${region}`,
    );

    const provider = this.getProviderByRegion(region);
    return provider.getArrivalInfo(stationId);
  }

  /**
   * Get arrivals for a specific route at a station
   * @param stationId - The station ID to query
   * @param routeId - The route ID to filter by
   * @param region - The region (defaults to Gyeonggi)
   * @returns Array of arrival information for the specified route
   */
  async getArrivalsByRoute(
    stationId: string,
    routeId: string,
    region: Region = Region.GG,
  ): Promise<ArrivalInfoDto[]> {
    this.logger.debug(
      `Fetching arrivals for route ${routeId} at station ${stationId} in region ${region}`,
    );

    const allArrivals = await this.getArrivalsByStation(stationId, region);
    return allArrivals.filter((arrival) => arrival.routeId === routeId);
  }

  /**
   * Get the appropriate provider for the given region
   * Currently only supports Gyeonggi region
   */
  private getProviderByRegion(region: Region): GyeonggiProvider {
    switch (region) {
      case Region.GG:
        return this.gyeonggiProvider;
      case Region.SEOUL:
        // TODO: Implement Seoul provider
        this.logger.warn(
          'Seoul region not yet supported, falling back to Gyeonggi',
        );
        return this.gyeonggiProvider;
      default:
        this.logger.warn(`Unknown region ${region}, falling back to Gyeonggi`);
        return this.gyeonggiProvider;
    }
  }
}
