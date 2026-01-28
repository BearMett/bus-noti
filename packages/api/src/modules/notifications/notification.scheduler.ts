import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { BusInfoProvider } from '../../providers/busInfoProvider/bus-info.provider';
import { NotificationsService } from './notifications.service';
import { AlertMessage, NotificationTarget } from '@busnoti/shared';

@Injectable()
export class NotificationScheduler {
  private readonly logger = new Logger(NotificationScheduler.name);

  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly busInfoProvider: BusInfoProvider,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkArrivalNotifications(): Promise<void> {
    this.logger.debug('Starting arrival notification check...');

    try {
      // Get all active subscriptions
      const subscriptions = await this.subscriptionsService.findActive();
      this.logger.debug(`Found ${subscriptions.length} active subscriptions`);

      for (const subscription of subscriptions) {
        try {
          // Check if within active time window
          if (!this.subscriptionsService.isWithinActiveTime(subscription)) {
            this.logger.debug(
              `Subscription ${subscription.id} is outside active time window`,
            );
            continue;
          }

          // Get arrivals for the subscribed route at the station
          const arrivals = await this.busInfoProvider.getArrivalsByRoute(
            subscription.stationId,
            subscription.routeId,
            subscription.region,
          );

          if (arrivals.length === 0) {
            this.logger.debug(
              `No arrivals found for subscription ${subscription.id}`,
            );
            continue;
          }

          // Check each arrival against lead time threshold
          const leadTimeSeconds = subscription.leadTimeMinutes * 60;

          for (const arrival of arrivals) {
            // Skip if arrival time is greater than lead time
            if (arrival.predictTimeSec > leadTimeSeconds) {
              this.logger.debug(
                `Arrival for plate ${arrival.plateNo} (${arrival.predictTimeMin} min) exceeds lead time (${subscription.leadTimeMinutes} min)`,
              );
              continue;
            }

            // Calculate predicted arrival time
            const now = new Date();
            const predictedArrivalTime = new Date(
              now.getTime() + arrival.predictTimeSec * 1000,
            );

            // Check if notification was already sent
            const alreadySent = await this.notificationsService.hasAlreadySent(
              subscription.id,
              arrival.plateNo,
              predictedArrivalTime,
            );

            if (alreadySent) {
              this.logger.debug(
                `Notification already sent for subscription ${subscription.id}, plate ${arrival.plateNo}`,
              );
              continue;
            }

            // Construct notification message
            const message: AlertMessage = {
              title: '버스 도착 알림',
              body: `버스 도착 알림: ${arrival.routeName}번 버스가 약 ${arrival.predictTimeMin}분 후 도착합니다`,
              data: {
                subscriptionId: subscription.id,
                routeId: arrival.routeId,
                routeName: arrival.routeName,
                plateNo: arrival.plateNo,
                predictTimeMin: arrival.predictTimeMin,
                predictTimeSec: arrival.predictTimeSec,
                remainStops: arrival.remainStops,
              },
            };

            // Parse channels from subscription
            const channels = JSON.parse(subscription.channels) as string[];

            // Build notification target
            // Note: In a real implementation, you would fetch user details to get push subscription and email
            const target: NotificationTarget = {
              userId: subscription.userId,
              // TODO: Fetch actual push subscription and email from user profile
              // pushSubscription: user.pushSubscription,
              // email: user.email,
            };

            // Send notification
            this.logger.log(
              `Sending notification for subscription ${subscription.id}: ${arrival.routeName} arriving in ${arrival.predictTimeMin} min`,
            );

            const results = await this.notificationsService.sendNotification(
              target,
              message,
              channels,
            );

            // Record notification for each successful channel
            for (const result of results) {
              if (result.success) {
                await this.notificationsService.recordNotification(
                  subscription.id,
                  arrival.plateNo,
                  predictedArrivalTime,
                  result.channel,
                );
              }
            }

            // Also record if we attempted to send (even if channels weren't available)
            // This prevents repeated attempts for the same arrival
            const anyAttempted = results.length > 0;
            const anySuccess = results.some((r) => r.success);

            if (anyAttempted && !anySuccess) {
              // Record with 'attempted' channel to prevent retries
              await this.notificationsService.recordNotification(
                subscription.id,
                arrival.plateNo,
                predictedArrivalTime,
                'attempted',
              );
              this.logger.warn(
                `Notification attempted but no channels available for subscription ${subscription.id}`,
              );
            }
          }
        } catch (subscriptionError) {
          // Log error but continue processing other subscriptions
          this.logger.error(
            `Error processing subscription ${subscription.id}`,
            subscriptionError instanceof Error
              ? subscriptionError.stack
              : subscriptionError,
          );
        }
      }

      this.logger.debug('Completed arrival notification check');
    } catch (error) {
      // Catch-all to prevent scheduler crashes
      this.logger.error(
        'Error in notification scheduler',
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
