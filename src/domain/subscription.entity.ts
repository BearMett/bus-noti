import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Region } from './region.enum';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column({
    type: 'varchar',
    enum: Region,
  })
  region: Region;

  @Column()
  @Index()
  stationId: string; // External station ID

  @Column()
  @Index()
  routeId: string; // External route ID

  @Column({ nullable: true })
  staOrder: number;

  @Column({ default: 5 })
  leadTimeMinutes: number;

  @Column()
  channels: string; // JSON stringified array of 'push' | 'email'

  @Column({ nullable: true })
  activeTimeStart: string; // HH:mm format

  @Column({ nullable: true })
  activeTimeEnd: string; // HH:mm format

  @Column({ nullable: true })
  activeDays: string; // JSON array of day numbers 0-6

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
