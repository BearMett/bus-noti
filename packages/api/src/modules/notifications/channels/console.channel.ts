import { Injectable, Logger } from '@nestjs/common';
import {
  AlertChannel,
  AlertMessage,
  NotificationTarget,
} from '@busnoti/shared';

@Injectable()
export class ConsoleChannel implements AlertChannel {
  readonly type = 'console';

  private readonly logger = new Logger(ConsoleChannel.name);

  isAvailable(_target: NotificationTarget): boolean {
    // Console channel is always available
    return true;
  }

  async send(
    target: NotificationTarget,
    message: AlertMessage,
  ): Promise<boolean> {
    const timestamp = new Date().toISOString();
    const separator = '='.repeat(60);

    this.logger.log(separator);
    this.logger.log(`[NOTIFICATION] ${timestamp}`);
    this.logger.log(separator);
    this.logger.log(`To: ${target.userId}`);
    this.logger.log(`Title: ${message.title}`);
    this.logger.log(`Body: ${message.body}`);

    if (message.data) {
      this.logger.log(`Data: ${JSON.stringify(message.data, null, 2)}`);
    }

    this.logger.log(separator);

    return Promise.resolve(true);
  }
}
