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

export interface AuthConfig {
  jwtSecret: string;
  accessTokenExpiry: string;
  refreshTokenExpiryDays: number;
  google: {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
  };
  github: {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
  };
}

export interface AppConfig {
  port: number;
  database: DatabaseConfig;
  apiKeys: ApiKeysConfig;
  webPush: WebPushConfig;
  smtp: SmtpConfig;
  auth: AuthConfig;
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
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshTokenExpiryDays:
      parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS ?? '7', 10) || 7,
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackUrl:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:3000/auth/google/callback',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackUrl:
        process.env.GITHUB_CALLBACK_URL ||
        'http://localhost:3000/auth/github/callback',
    },
  },
});
