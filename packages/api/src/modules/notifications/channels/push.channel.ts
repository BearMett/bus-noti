import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as webpush from 'web-push';
import { AlertChannel, AlertMessage, NotificationTarget } from '@busnoti/shared';

@Injectable()
export class PushChannel implements AlertChannel {
  readonly type = 'push';
  private readonly logger = new Logger(PushChannel.name);
  private readonly isConfigured: boolean;

  constructor(private readonly configService: ConfigService) {
    const vapidPublicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
    const vapidSubject = this.configService.get<string>(
      'VAPID_SUBJECT',
      'mailto:admin@example.com',
    );

    if (vapidPublicKey && vapidPrivateKey) {
      try {
        webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
        this.isConfigured = true;
        this.logger.log('Push channel initialized with VAPID credentials');
      } catch (error) {
        this.logger.error('Failed to initialize VAPID credentials', error);
        this.isConfigured = false;
      }
    } else {
      this.logger.warn(
        'VAPID keys not configured. Push notifications will be disabled.',
      );
      this.isConfigured = false;
    }
  }

  isAvailable(target: NotificationTarget): boolean {
    return (
      this.isConfigured &&
      !!target.pushSubscription &&
      !!target.pushSubscription.endpoint &&
      !!target.pushSubscription.keys?.p256dh &&
      !!target.pushSubscription.keys?.auth
    );
  }

  async send(
    target: NotificationTarget,
    message: AlertMessage,
  ): Promise<boolean> {
    if (!this.isAvailable(target)) {
      this.logger.warn(
        `Push notification not available for user ${target.userId}`,
      );
      return false;
    }

    const payload = JSON.stringify({
      title: message.title,
      body: message.body,
      data: message.data,
    });

    try {
      await webpush.sendNotification(
        {
          endpoint: target.pushSubscription!.endpoint,
          keys: {
            p256dh: target.pushSubscription!.keys.p256dh,
            auth: target.pushSubscription!.keys.auth,
          },
        },
        payload,
      );

      this.logger.debug(
        `Push notification sent successfully to user ${target.userId}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send push notification to user ${target.userId}`,
        error instanceof Error ? error.stack : error,
      );
      return false;
    }
  }
}
