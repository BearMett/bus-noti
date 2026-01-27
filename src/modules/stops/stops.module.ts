import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stop, Route, StopRoute } from '../../domain';
import { GyeonggiProvider } from '../../providers/gyeonggi';
import { StopsService } from './stops.service';
import { StopsController } from './stops.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Stop, Route, StopRoute])],
  controllers: [StopsController],
  providers: [GyeonggiProvider, StopsService],
  exports: [GyeonggiProvider, StopsService],
})
export class StopsModule {}
