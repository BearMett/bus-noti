import { Module } from '@nestjs/common';
import { BusInfoModule } from '../../providers/busInfoProvider/bus-info.module';
import { StopsService } from './stops.service';
import { StopsController } from './stops.controller';

@Module({
  imports: [BusInfoModule],
  controllers: [StopsController],
  providers: [StopsService],
  exports: [StopsService],
})
export class StopsModule {}
