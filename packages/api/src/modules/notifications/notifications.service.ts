import { Injectable, Logger } from '@nestjs/common';
import { Notification } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PushChannel } from './channels/push.channel';
import { EmailChannel } from './channels/email.channel';
import { ConsoleChannel } from './channels/console.channel';
import { AlertMessage, NotificationTarget } from '@busnoti/shared';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pushChannel: PushChannel,
    private readonly emailChannel: EmailChannel,
    private readonly consoleChannel: ConsoleChannel,
  ) {}

  /**
   * Check if a notification was already sent for this subscription, vehicle, and arrival time
   * Uses approximate time comparison within 10 minutes to avoid duplicate notifications
   */
  async hasAlreadySent(
    subscriptionId: string,
    plateNo: string,
    arrivalTime: Date,
  ): Promise<boolean> {
    const TEN_MINUTES_MS = 10 * 60 * 1000;

    const timeWindowStart = new Date(arrivalTime.getTime() - TEN_MINUTES_MS);
    const timeWindowEnd = new Date(arrivalTime.getTime() + TEN_MINUTES_MS);

    const existingNotification = await this.prisma.notification.findFirst({
      where: {
        subscriptionId,
        plateNo,
        predictedArrivalAt: {
          gte: timeWindowStart,
          lte: timeWindowEnd,
        },
      },
    });

    if (existingNotification) {
      this.logger.debug(
        `Notification already sent for subscription ${subscriptionId}, plate ${plateNo}, arrival ~${arrivalTime.toISOString()}`,
      );
      return true;
    }

    return false;
  }

  /**
   * Record a notification that was sent
   */
  async recordNotification(
    subscriptionId: string,
    plateNo: string,
    arrivalTime: Date,
    channel: string,
  ): Promise<Notification> {
    const notification = await this.prisma.notification.create({
      data: {
        subscriptionId,
        plateNo,
        predictedArrivalAt: arrivalTime,
        sentAt: new Date(),
        channel,
      },
    });

    this.logger.debug(
      `Recorded notification ${notification.id} for subscription ${subscriptionId} via ${channel}`,
    );

    return notification;
  }

  /**
   * Send notification via requested channels
   */
  async sendNotification(
    target: NotificationTarget,
    message: AlertMessage,
    channels: string[],
  ): Promise<{ channel: string; success: boolean }[]> {
    const results: { channel: string; success: boolean }[] = [];

    for (const channelType of channels) {
      let success = false;

      try {
        switch (channelType) {
          case 'push':
            if (this.pushChannel.isAvailable(target)) {
              success = await this.pushChannel.send(target, message);
            } else {
              this.logger.warn(
                `Push channel not available for user ${target.userId}`,
              );
            }
            break;

          case 'email':
            if (this.emailChannel.isAvailable(target)) {
              success = await this.emailChannel.send(target, message);
            } else {
              this.logger.warn(
                `Email channel not available for user ${target.userId}`,
              );
            }
            break;

          case 'console':
            if (this.consoleChannel.isAvailable(target)) {
              success = await this.consoleChannel.send(target, message);
            }
            break;

          default:
            this.logger.warn(`Unknown channel type: ${channelType}`);
        }
      } catch (error) {
        this.logger.error(
          `Failed to send notification via ${channelType} to user ${target.userId}`,
          error instanceof Error ? error.stack : error,
        );
      }

      results.push({ channel: channelType, success });
    }

    return results;
  }
}
