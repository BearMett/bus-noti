import { Module } from '@nestjs/common';
import { GyeonggiProvider } from '../../providers/gyeonggi/gyeonggi.provider';
import { SeoulProvider } from '../../providers/seoul/seoul.provider';
import { StopsService } from './stops.service';
import { StopsController } from './stops.controller';

@Module({
  controllers: [StopsController],
  providers: [GyeonggiProvider, SeoulProvider, StopsService],
  exports: [GyeonggiProvider, SeoulProvider, StopsService],
})
export class StopsModule {}
