import { Module } from '@nestjs/common';
import { GyeonggiProvider } from '../../providers/gyeonggi/gyeonggi.provider';
import { SeoulProvider } from '../../providers/seoul/seoul.provider';
import { ArrivalsService } from './arrivals.service';

@Module({
  providers: [GyeonggiProvider, SeoulProvider, ArrivalsService],
  exports: [ArrivalsService],
})
export class ArrivalsModule {}
