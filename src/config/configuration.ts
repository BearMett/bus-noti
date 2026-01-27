/**
 * Configuration module for NestJS bus notification service
 * Reads environment variables and provides typed configuration
 */

export interface DatabaseConfig {
  path: string;
}

export interface ApiKeysConfig {
  gyeonggiApiKey: string;
  seoulApiKey: string;
}

export interface WebPushConfig {
  publicKey: string;
  privateKey: string;
  contact: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export interface AppConfig {
  port: number;
  database: DatabaseConfig;
  apiKeys: ApiKeysConfig;
  webPush: WebPushConfig;
  smtp: SmtpConfig;
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '3000', 10) || 3000,
  database: {
    path: process.env.DATABASE_PATH || './data/busnoti.sqlite',
  },
  apiKeys: {
    gyeonggiApiKey: process.env.GYEONGGI_API_KEY || '',
    seoulApiKey: process.env.SEOUL_API_KEY || '',
  },
  webPush: {
    publicKey: process.env.WEB_PUSH_PUBLIC_KEY || '',
    privateKey: process.env.WEB_PUSH_PRIVATE_KEY || '',
    contact: process.env.WEB_PUSH_CONTACT || '',
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT ?? '587', 10) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || '',
  },
});
