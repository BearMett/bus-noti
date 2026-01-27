import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification, Subscription } from '../../domain';
import { SubscriptionsModule } from '../subscriptions';
import { ArrivalsModule } from '../arrivals';
import { PushChannel, EmailChannel } from './channels';
import { NotificationsService } from './notifications.service';
import { NotificationScheduler } from './notification.scheduler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, Subscription]),
    SubscriptionsModule,
    ArrivalsModule,
  ],
  providers: [
    PushChannel,
    EmailChannel,
    NotificationsService,
    NotificationScheduler,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
