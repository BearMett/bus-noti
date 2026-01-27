export interface AlertMessage {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface NotificationTarget {
  userId: string;
  pushSubscription?: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
  email?: string;
}

export interface AlertChannel {
  readonly type: string;
  send(target: NotificationTarget, message: AlertMessage): Promise<boolean>;
  isAvailable(target: NotificationTarget): boolean;
}
