import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { Subscription } from './subscription.entity';

@Entity('notifications')
@Unique(['subscriptionId', 'plateNo', 'predictedArrivalAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  subscriptionId: string;

  @Column()
  plateNo: string; // Vehicle number

  @Column()
  predictedArrivalAt: Date;

  @Column()
  sentAt: Date;

  @Column()
  channel: string;

  @ManyToOne(() => Subscription)
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription;
}
