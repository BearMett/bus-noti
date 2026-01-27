import { Injectable, Logger } from '@nestjs/common';
import { Region } from '@prisma/client';
import { BusProvider, ArrivalInfoDto } from '../../providers/bus-provider.interface';
import { GyeonggiProvider } from '../../providers/gyeonggi/gyeonggi.provider';
import { SeoulProvider } from '../../providers/seoul/seoul.provider';

@Injectable()
export class ArrivalsService {
  private readonly logger = new Logger(ArrivalsService.name);
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

  private getProviderByRegion(region: Region): BusProvider {
    const provider = this.providers.get(region);
    if (!provider) {
      this.logger.warn(`Unknown region ${region}, falling back to Gyeonggi`);
      return this.gyeonggiProvider;
    }
    return provider;
  }
}
