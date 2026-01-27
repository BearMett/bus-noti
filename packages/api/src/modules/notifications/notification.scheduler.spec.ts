import { Test, TestingModule } from '@nestjs/testing';
import { NotificationScheduler } from './notification.scheduler';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { ArrivalsService } from '../arrivals/arrivals.service';
import { NotificationsService } from './notifications.service';
import { Subscription } from '@prisma/client';
import { ArrivalInfoDto, Region } from '@busnoti/shared';

describe('NotificationScheduler', () => {
  let scheduler: NotificationScheduler;
  let subscriptionsService: jest.Mocked<SubscriptionsService>;
  let arrivalsService: jest.Mocked<ArrivalsService>;
  let notificationsService: jest.Mocked<NotificationsService>;

  const createMockSubscription = (
    overrides: Partial<Subscription> = {},
  ): Subscription => ({
    id: 'sub-1',
    userId: 'user-1',
    region: Region.GG,
    stationId: 'station-1',
    routeId: 'route-1',
    staOrder: null,
    leadTimeMinutes: 10, // 10분 전 알림
    channels: '["console"]',
    activeTimeStart: '08:00',
    activeTimeEnd: '08:30',
    activeDays: '[1,2,3,4,5]',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  const createMockArrival = (
    overrides: Partial<ArrivalInfoDto> = {},
  ): ArrivalInfoDto => ({
    routeId: 'route-1',
    routeName: '100',
    predictTimeSec: 480, // 8분 (leadTime 10분 이내)
    predictTimeMin: 8,
    plateNo: '경기70바1234',
    staOrder: 5,
    ...overrides,
  });

  beforeEach(async () => {
    const mockSubscriptionsService = {
      findActive: jest.fn(),
      isWithinActiveTime: jest.fn(),
    };

    const mockArrivalsService = {
      getArrivalsByRoute: jest.fn(),
    };

    const mockNotificationsService = {
      hasAlreadySent: jest.fn(),
      sendNotification: jest.fn(),
      recordNotification: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationScheduler,
        { provide: SubscriptionsService, useValue: mockSubscriptionsService },
        { provide: ArrivalsService, useValue: mockArrivalsService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    scheduler = module.get<NotificationScheduler>(NotificationScheduler);
    subscriptionsService = module.get(SubscriptionsService);
    arrivalsService = module.get(ArrivalsService);
    notificationsService = module.get(NotificationsService);
  });

  describe('checkArrivalNotifications', () => {
    describe('subscription filtering', () => {
      it('should skip subscriptions outside active time window', async () => {
        const subscription = createMockSubscription();
        subscriptionsService.findActive.mockResolvedValue([subscription]);
        subscriptionsService.isWithinActiveTime.mockReturnValue(false);

        await scheduler.checkArrivalNotifications();

        expect(subscriptionsService.findActive).toHaveBeenCalled();
        expect(subscriptionsService.isWithinActiveTime).toHaveBeenCalledWith(
          subscription,
        );
        // Should NOT call arrivals API when outside time window
        expect(arrivalsService.getArrivalsByRoute).not.toHaveBeenCalled();
      });

      it('should process subscriptions within active time window', async () => {
        const subscription = createMockSubscription();
        subscriptionsService.findActive.mockResolvedValue([subscription]);
        subscriptionsService.isWithinActiveTime.mockReturnValue(true);
        arrivalsService.getArrivalsByRoute.mockResolvedValue([]);

        await scheduler.checkArrivalNotifications();

        expect(arrivalsService.getArrivalsByRoute).toHaveBeenCalledWith(
          subscription.stationId,
          subscription.routeId,
          subscription.region,
        );
      });
    });

    describe('leadTime threshold', () => {
      it('should send notification when arrival is within leadTime', async () => {
        const subscription = createMockSubscription({ leadTimeMinutes: 10 });
        const arrival = createMockArrival({ predictTimeSec: 480 }); // 8분 (10분 이내)

        subscriptionsService.findActive.mockResolvedValue([subscription]);
        subscriptionsService.isWithinActiveTime.mockReturnValue(true);
        arrivalsService.getArrivalsByRoute.mockResolvedValue([arrival]);
        notificationsService.hasAlreadySent.mockResolvedValue(false);
        notificationsService.sendNotification.mockResolvedValue([
          { channel: 'console', success: true },
        ]);

        await scheduler.checkArrivalNotifications();

        expect(notificationsService.sendNotification).toHaveBeenCalled();
        expect(notificationsService.recordNotification).toHaveBeenCalled();
      });

      it('should NOT send notification when arrival exceeds leadTime', async () => {
        const subscription = createMockSubscription({ leadTimeMinutes: 5 });
        const arrival = createMockArrival({ predictTimeSec: 480 }); // 8분 (5분 초과)

        subscriptionsService.findActive.mockResolvedValue([subscription]);
        subscriptionsService.isWithinActiveTime.mockReturnValue(true);
        arrivalsService.getArrivalsByRoute.mockResolvedValue([arrival]);

        await scheduler.checkArrivalNotifications();

        expect(notificationsService.sendNotification).not.toHaveBeenCalled();
      });

      it('should send notification at exactly leadTime threshold', async () => {
        const subscription = createMockSubscription({ leadTimeMinutes: 10 });
        const arrival = createMockArrival({ predictTimeSec: 600 }); // 정확히 10분

        subscriptionsService.findActive.mockResolvedValue([subscription]);
        subscriptionsService.isWithinActiveTime.mockReturnValue(true);
        arrivalsService.getArrivalsByRoute.mockResolvedValue([arrival]);
        notificationsService.hasAlreadySent.mockResolvedValue(false);
        notificationsService.sendNotification.mockResolvedValue([
          { channel: 'console', success: true },
        ]);

        await scheduler.checkArrivalNotifications();

        expect(notificationsService.sendNotification).toHaveBeenCalled();
      });
    });

    describe('duplicate notification prevention', () => {
      it('should NOT send notification if already sent', async () => {
        const subscription = createMockSubscription();
        const arrival = createMockArrival();

        subscriptionsService.findActive.mockResolvedValue([subscription]);
        subscriptionsService.isWithinActiveTime.mockReturnValue(true);
        arrivalsService.getArrivalsByRoute.mockResolvedValue([arrival]);
        notificationsService.hasAlreadySent.mockResolvedValue(true);

        await scheduler.checkArrivalNotifications();

        expect(notificationsService.hasAlreadySent).toHaveBeenCalled();
        expect(notificationsService.sendNotification).not.toHaveBeenCalled();
      });
    });

    describe('multiple arrivals', () => {
      it('should process multiple arrivals for same route', async () => {
        const subscription = createMockSubscription({ leadTimeMinutes: 15 });
        const arrival1 = createMockArrival({
          predictTimeSec: 300, // 5분
          plateNo: '경기70바1111',
        });
        const arrival2 = createMockArrival({
          predictTimeSec: 720, // 12분
          plateNo: '경기70바2222',
        });

        subscriptionsService.findActive.mockResolvedValue([subscription]);
        subscriptionsService.isWithinActiveTime.mockReturnValue(true);
        arrivalsService.getArrivalsByRoute.mockResolvedValue([
          arrival1,
          arrival2,
        ]);
        notificationsService.hasAlreadySent.mockResolvedValue(false);
        notificationsService.sendNotification.mockResolvedValue([
          { channel: 'console', success: true },
        ]);

        await scheduler.checkArrivalNotifications();

        // Both arrivals within 15 min leadTime
        expect(notificationsService.sendNotification).toHaveBeenCalledTimes(2);
      });
    });

    describe('notification message content', () => {
      it('should include correct bus info in notification', async () => {
        const subscription = createMockSubscription();
        const arrival = createMockArrival({
          routeName: '9003',
          predictTimeMin: 7,
        });

        subscriptionsService.findActive.mockResolvedValue([subscription]);
        subscriptionsService.isWithinActiveTime.mockReturnValue(true);
        arrivalsService.getArrivalsByRoute.mockResolvedValue([arrival]);
        notificationsService.hasAlreadySent.mockResolvedValue(false);
        notificationsService.sendNotification.mockResolvedValue([
          { channel: 'console', success: true },
        ]);

        await scheduler.checkArrivalNotifications();

        expect(notificationsService.sendNotification).toHaveBeenCalledWith(
          expect.objectContaining({ userId: 'user-1' }),
          expect.objectContaining({
            title: '버스 도착 알림',
            body: expect.stringContaining('9003'),
          }),
          ['console'],
        );
      });
    });

    describe('error handling', () => {
      it('should continue processing other subscriptions on error', async () => {
        const subscription1 = createMockSubscription({ id: 'sub-1' });
        const subscription2 = createMockSubscription({ id: 'sub-2' });

        subscriptionsService.findActive.mockResolvedValue([
          subscription1,
          subscription2,
        ]);
        subscriptionsService.isWithinActiveTime.mockReturnValue(true);

        // First subscription throws error
        arrivalsService.getArrivalsByRoute
          .mockRejectedValueOnce(new Error('API error'))
          .mockResolvedValueOnce([]);

        await scheduler.checkArrivalNotifications();

        // Should still call for second subscription
        expect(arrivalsService.getArrivalsByRoute).toHaveBeenCalledTimes(2);
      });

      it('should handle empty active subscriptions', async () => {
        subscriptionsService.findActive.mockResolvedValue([]);

        await expect(
          scheduler.checkArrivalNotifications(),
        ).resolves.not.toThrow();
        expect(arrivalsService.getArrivalsByRoute).not.toHaveBeenCalled();
      });

      it('should handle no arrivals for a subscription', async () => {
        const subscription = createMockSubscription();

        subscriptionsService.findActive.mockResolvedValue([subscription]);
        subscriptionsService.isWithinActiveTime.mockReturnValue(true);
        arrivalsService.getArrivalsByRoute.mockResolvedValue([]);

        await expect(
          scheduler.checkArrivalNotifications(),
        ).resolves.not.toThrow();
        expect(notificationsService.sendNotification).not.toHaveBeenCalled();
      });
    });

    describe('user scenario: 강서구청 1번버스 8시-8시30분 10분전 알림', () => {
      it('should send notification for arrival within time window and lead time', async () => {
        // 구독: 강서구청 정류장, 1번 버스, 8시-8시30분, 10분 전 알림
        const subscription = createMockSubscription({
          stationId: 'gangseo-gucheong',
          routeId: '1',
          activeTimeStart: '08:00',
          activeTimeEnd: '08:30',
          leadTimeMinutes: 10,
        });

        // 도착정보: 8분 후 도착
        const arrival = createMockArrival({
          routeId: '1',
          routeName: '1',
          predictTimeSec: 480, // 8분
          predictTimeMin: 8,
        });

        subscriptionsService.findActive.mockResolvedValue([subscription]);
        subscriptionsService.isWithinActiveTime.mockReturnValue(true); // 현재 8:15
        arrivalsService.getArrivalsByRoute.mockResolvedValue([arrival]);
        notificationsService.hasAlreadySent.mockResolvedValue(false);
        notificationsService.sendNotification.mockResolvedValue([
          { channel: 'console', success: true },
        ]);

        await scheduler.checkArrivalNotifications();

        // 알림 발송 확인
        expect(notificationsService.sendNotification).toHaveBeenCalledWith(
          expect.objectContaining({ userId: 'user-1' }),
          expect.objectContaining({
            body: expect.stringContaining('1번 버스가 약 8분 후 도착'),
          }),
          ['console'],
        );
        expect(notificationsService.recordNotification).toHaveBeenCalled();
      });

      it('should NOT send notification when outside time window', async () => {
        const subscription = createMockSubscription({
          activeTimeStart: '08:00',
          activeTimeEnd: '08:30',
          leadTimeMinutes: 10,
        });

        const arrival = createMockArrival({ predictTimeSec: 480 });

        subscriptionsService.findActive.mockResolvedValue([subscription]);
        subscriptionsService.isWithinActiveTime.mockReturnValue(false); // 현재 9:00 (시간대 외)
        arrivalsService.getArrivalsByRoute.mockResolvedValue([arrival]);

        await scheduler.checkArrivalNotifications();

        expect(arrivalsService.getArrivalsByRoute).not.toHaveBeenCalled();
        expect(notificationsService.sendNotification).not.toHaveBeenCalled();
      });

      it('should NOT send notification when arrival exceeds lead time', async () => {
        const subscription = createMockSubscription({
          leadTimeMinutes: 10,
        });

        // 12분 후 도착 (10분 리드타임 초과)
        const arrival = createMockArrival({
          predictTimeSec: 720, // 12분
          predictTimeMin: 12,
        });

        subscriptionsService.findActive.mockResolvedValue([subscription]);
        subscriptionsService.isWithinActiveTime.mockReturnValue(true);
        arrivalsService.getArrivalsByRoute.mockResolvedValue([arrival]);

        await scheduler.checkArrivalNotifications();

        expect(notificationsService.sendNotification).not.toHaveBeenCalled();
      });
    });
  });
});
