import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { Stop } from './stop.entity';
import { Route } from './route.entity';

@Entity('stop_routes')
@Unique(['stopId', 'routeId'])
export class StopRoute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  stopId: string;

  @Column()
  @Index()
  routeId: string;

  @Column()
  staOrder: number; // 정류소 순번

  @ManyToOne(() => Stop)
  @JoinColumn({ name: 'stopId' })
  stop: Stop;

  @ManyToOne(() => Route)
  @JoinColumn({ name: 'routeId' })
  route: Route;
}
