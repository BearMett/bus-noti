import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import {
  AlertChannel,
  AlertMessage,
  NotificationTarget,
} from '@busnoti/shared';

@Injectable()
export class EmailChannel implements AlertChannel {
  readonly type = 'email';
  private readonly logger = new Logger(EmailChannel.name);
  private readonly transporter: Transporter | null = null;
  private readonly fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT', 587);
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    const smtpSecure = this.configService.get<boolean>('SMTP_SECURE', false);

    this.fromAddress = this.configService.get<string>(
      'SMTP_FROM',
      'noreply@example.com',
    );

    if (smtpHost && smtpUser && smtpPass) {
      try {
        this.transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });
        this.logger.log('Email channel initialized with SMTP configuration');
      } catch (error) {
        this.logger.error('Failed to initialize SMTP transporter', error);
      }
    } else {
      this.logger.warn(
        'SMTP settings not configured. Email notifications will be disabled.',
      );
    }
  }

  isAvailable(target: NotificationTarget): boolean {
    return this.transporter !== null && !!target.email;
  }

  async send(
    target: NotificationTarget,
    message: AlertMessage,
  ): Promise<boolean> {
    if (!this.isAvailable(target)) {
      this.logger.warn(
        `Email notification not available for user ${target.userId}`,
      );
      return false;
    }

    const htmlBody = this.formatHtmlBody(message);

    try {
      await this.transporter!.sendMail({
        from: this.fromAddress,
        to: target.email,
        subject: message.title,
        text: message.body,
        html: htmlBody,
      });

      this.logger.debug(
        `Email sent successfully to user ${target.userId} (${target.email})`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send email to user ${target.userId} (${target.email})`,
        error instanceof Error ? error.stack : error,
      );
      return false;
    }
  }

  private formatHtmlBody(message: AlertMessage): string {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(message.title)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      border-bottom: 2px solid #e9ecef;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      color: #212529;
    }
    .content {
      padding: 20px;
      background-color: #ffffff;
      border: 1px solid #e9ecef;
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
      font-size: 12px;
      color: #6c757d;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${this.escapeHtml(message.title)}</h1>
  </div>
  <div class="content">
    <p>${this.escapeHtml(message.body).replace(/\n/g, '<br>')}</p>
  </div>
  <div class="footer">
    <p>This is an automated notification.</p>
  </div>
</body>
</html>`;

    return html;
  }

  private escapeHtml(text: string): string {
    const htmlEntities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
  }
}
