import { Module } from '@nestjs/common';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { ArrivalsModule } from '../arrivals/arrivals.module';
import { PushChannel } from './channels/push.channel';
import { EmailChannel } from './channels/email.channel';
import { NotificationsService } from './notifications.service';
import { NotificationScheduler } from './notification.scheduler';

@Module({
  imports: [SubscriptionsModule, ArrivalsModule],
  providers: [
    PushChannel,
    EmailChannel,
    NotificationsService,
    NotificationScheduler,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
