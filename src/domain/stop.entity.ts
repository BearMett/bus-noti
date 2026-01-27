import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Region } from './region.enum';

@Entity('stops')
export class Stop {
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
  name: string;

  @Column({ nullable: true })
  arsId: string; // 정류소번호 (Seoul)

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
