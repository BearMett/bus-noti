import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Region } from './region.enum';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  externalId: string;

  @Column({
    type: 'varchar',
    enum: Region,
  })
  @Index()
  region: Region;

  @Column()
  name: string; // Route name like "5000"

  @Column({ nullable: true })
  routeType: string; // 일반/광역 등

  @CreateDateColumn()
  createdAt: Date;
}
