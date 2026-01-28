import { Module } from '@nestjs/common';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { BusInfoModule } from '../../providers/busInfoProvider/bus-info.module';
import { PushChannel } from './channels/push.channel';
import { EmailChannel } from './channels/email.channel';
import { ConsoleChannel } from './channels/console.channel';
import { NotificationsService } from './notifications.service';
import { NotificationScheduler } from './notification.scheduler';

@Module({
  imports: [SubscriptionsModule, BusInfoModule],
  providers: [
    PushChannel,
    EmailChannel,
    ConsoleChannel,
    NotificationsService,
    NotificationScheduler,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
