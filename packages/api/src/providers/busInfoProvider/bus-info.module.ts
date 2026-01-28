import { Module } from '@nestjs/common';
import { BusInfoProvider } from './bus-info.provider';
import { GyeonggiProvider } from '../gyeonggi/gyeonggi.provider';
import { SeoulProvider } from '../seoul/seoul.provider';

@Module({
  providers: [GyeonggiProvider, SeoulProvider, BusInfoProvider],
  exports: [BusInfoProvider],
})
export class BusInfoModule {}
