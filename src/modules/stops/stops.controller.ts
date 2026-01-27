import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { StopsService } from './stops.service';
import { SearchStopsQueryDto } from './dto/search-stops.dto';
import { Region } from '@prisma/client';
import {
  StationDto,
  RouteDto,
  ArrivalInfoDto,
} from '../../providers/bus-provider.interface';

@Controller('stops')
export class StopsController {
  constructor(private readonly stopsService: StopsService) {}

  /**
   * GET /stops?keyword=xxx - Search by keyword
   * GET /stops?lat=xxx&lng=xxx - Search by location
   */
  @Get()
  async searchStops(
    @Query() query: SearchStopsQueryDto,
  ): Promise<StationDto[]> {
    const { keyword, lat, lng, region } = query;

    // Search by keyword
    if (keyword) {
      return this.stopsService.searchByKeyword(keyword, region);
    }

    // Search by location
    if (lat !== undefined && lng !== undefined) {
      return this.stopsService.searchByLocation(lat, lng, region);
    }

    throw new BadRequestException(
      'Either keyword or both lat and lng must be provided',
    );
  }

  /**
   * GET /stops/:stationId/routes - Get routes for a station
   */
  @Get(':stationId/routes')
  async getRoutesByStation(
    @Param('stationId') stationId: string,
    @Query('region') region?: Region,
  ): Promise<RouteDto[]> {
    return this.stopsService.getRoutesByStation(stationId, region);
  }

  /**
   * GET /stops/:stationId/arrivals - Get arrival info for a station
   */
  @Get(':stationId/arrivals')
  async getArrivalInfo(
    @Param('stationId') stationId: string,
    @Query('region') region?: Region,
  ): Promise<ArrivalInfoDto[]> {
    return this.stopsService.getArrivalInfo(stationId, region);
  }
}
