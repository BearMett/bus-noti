import { Module } from '@nestjs/common';
import { GyeonggiProvider } from '../../providers/gyeonggi';
import { ArrivalsService } from './arrivals.service';

@Module({
  providers: [GyeonggiProvider, ArrivalsService],
  exports: [ArrivalsService],
})
export class ArrivalsModule {}
