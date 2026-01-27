import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsService } from './subscriptions.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Subscription, Region } from '@prisma/client';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let prismaService: jest.Mocked<PrismaService>;

  const createMockSubscription = (
    overrides: Partial<Subscription> = {},
  ): Subscription => ({
    id: 'sub-1',
    userId: 'user-1',
    region: Region.GG,
    stationId: 'station-1',
    routeId: 'route-1',
    staOrder: null,
    leadTimeMinutes: 5,
    channels: '["console"]',
    activeTimeStart: null,
    activeTimeEnd: null,
    activeDays: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  beforeEach(async () => {
    const mockPrismaService = {
      subscription: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('isWithinActiveTime', () => {
    describe('without time restrictions', () => {
      it('should return true when no time restrictions set', () => {
        const subscription = createMockSubscription();

        expect(service.isWithinActiveTime(subscription)).toBe(true);
      });

      it('should return true when only activeTimeStart is set', () => {
        const subscription = createMockSubscription({
          activeTimeStart: '08:00',
          activeTimeEnd: null,
        });

        expect(service.isWithinActiveTime(subscription)).toBe(true);
      });

      it('should return true when only activeTimeEnd is set', () => {
        const subscription = createMockSubscription({
          activeTimeStart: null,
          activeTimeEnd: '18:00',
        });

        expect(service.isWithinActiveTime(subscription)).toBe(true);
      });
    });

    describe('normal time range (e.g., 08:00-08:30)', () => {
      const setMockTime = (hours: number, minutes: number, day = 1) => {
        const mockDate = new Date(2024, 0, day, hours, minutes, 0);
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);
      };

      it('should return true when current time is within range', () => {
        setMockTime(8, 15); // 08:15
        const subscription = createMockSubscription({
          activeTimeStart: '08:00',
          activeTimeEnd: '08:30',
        });

        expect(service.isWithinActiveTime(subscription)).toBe(true);
      });

      it('should return true at exactly start time', () => {
        setMockTime(8, 0); // 08:00
        const subscription = createMockSubscription({
          activeTimeStart: '08:00',
          activeTimeEnd: '08:30',
        });

        expect(service.isWithinActiveTime(subscription)).toBe(true);
      });

      it('should return true at exactly end time', () => {
        setMockTime(8, 30); // 08:30
        const subscription = createMockSubscription({
          activeTimeStart: '08:00',
          activeTimeEnd: '08:30',
        });

        expect(service.isWithinActiveTime(subscription)).toBe(true);
      });

      it('should return false before start time', () => {
        setMockTime(7, 59); // 07:59
        const subscription = createMockSubscription({
          activeTimeStart: '08:00',
          activeTimeEnd: '08:30',
        });

        expect(service.isWithinActiveTime(subscription)).toBe(false);
      });

      it('should return false after end time', () => {
        setMockTime(8, 31); // 08:31
        const subscription = createMockSubscription({
          activeTimeStart: '08:00',
          activeTimeEnd: '08:30',
        });

        expect(service.isWithinActiveTime(subscription)).toBe(false);
      });

      it('should return false well outside range', () => {
        setMockTime(14, 0); // 14:00
        const subscription = createMockSubscription({
          activeTimeStart: '08:00',
          activeTimeEnd: '08:30',
        });

        expect(service.isWithinActiveTime(subscription)).toBe(false);
      });
    });

    describe('overnight time range (e.g., 22:00-06:00)', () => {
      const setMockTime = (hours: number, minutes: number, day = 1) => {
        const mockDate = new Date(2024, 0, day, hours, minutes, 0);
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);
      };

      it('should return true at 23:00 (within overnight range)', () => {
        setMockTime(23, 0); // 23:00
        const subscription = createMockSubscription({
          activeTimeStart: '22:00',
          activeTimeEnd: '06:00',
        });

        expect(service.isWithinActiveTime(subscription)).toBe(true);
      });

      it('should return true at 05:00 (within overnight range)', () => {
        setMockTime(5, 0); // 05:00
        const subscription = createMockSubscription({
          activeTimeStart: '22:00',
          activeTimeEnd: '06:00',
        });

        expect(service.isWithinActiveTime(subscription)).toBe(true);
      });

      it('should return true at exactly 22:00 (start time)', () => {
        setMockTime(22, 0); // 22:00
        const subscription = createMockSubscription({
          activeTimeStart: '22:00',
          activeTimeEnd: '06:00',
        });

        expect(service.isWithinActiveTime(subscription)).toBe(true);
      });

      it('should return true at exactly 06:00 (end time)', () => {
        setMockTime(6, 0); // 06:00
        const subscription = createMockSubscription({
          activeTimeStart: '22:00',
          activeTimeEnd: '06:00',
        });

        expect(service.isWithinActiveTime(subscription)).toBe(true);
      });

      it('should return false at 12:00 (outside overnight range)', () => {
        setMockTime(12, 0); // 12:00
        const subscription = createMockSubscription({
          activeTimeStart: '22:00',
          activeTimeEnd: '06:00',
        });

        expect(service.isWithinActiveTime(subscription)).toBe(false);
      });

      it('should return false at 21:59 (just before overnight start)', () => {
        setMockTime(21, 59); // 21:59
        const subscription = createMockSubscription({
          activeTimeStart: '22:00',
          activeTimeEnd: '06:00',
        });

        expect(service.isWithinActiveTime(subscription)).toBe(false);
      });
    });

    describe('day filtering', () => {
      const setMockTimeWithDay = (
        hours: number,
        minutes: number,
        dayOfWeek: number,
      ) => {
        // 2024-01-07 is Sunday (0), 2024-01-08 is Monday (1), etc.
        const baseDate = new Date(2024, 0, 7 + dayOfWeek, hours, minutes, 0);
        jest.useFakeTimers();
        jest.setSystemTime(baseDate);
      };

      it('should return true on active day (Monday=1)', () => {
        setMockTimeWithDay(8, 15, 1); // Monday
        const subscription = createMockSubscription({
          activeTimeStart: '08:00',
          activeTimeEnd: '18:00',
          activeDays: '[1, 2, 3, 4, 5]', // Weekdays
        });

        expect(service.isWithinActiveTime(subscription)).toBe(true);
      });

      it('should return false on inactive day (Sunday=0)', () => {
        setMockTimeWithDay(8, 15, 0); // Sunday
        const subscription = createMockSubscription({
          activeTimeStart: '08:00',
          activeTimeEnd: '18:00',
          activeDays: '[1, 2, 3, 4, 5]', // Weekdays only
        });

        expect(service.isWithinActiveTime(subscription)).toBe(false);
      });

      it('should return true on Saturday (6) when included', () => {
        setMockTimeWithDay(8, 15, 6); // Saturday
        const subscription = createMockSubscription({
          activeTimeStart: '08:00',
          activeTimeEnd: '18:00',
          activeDays: '[0, 6]', // Weekends only
        });

        expect(service.isWithinActiveTime(subscription)).toBe(true);
      });

      it('should return true when activeDays is empty array', () => {
        setMockTimeWithDay(8, 15, 3); // Wednesday
        const subscription = createMockSubscription({
          activeTimeStart: '08:00',
          activeTimeEnd: '18:00',
          activeDays: '[]', // Empty = all days
        });

        expect(service.isWithinActiveTime(subscription)).toBe(true);
      });

      it('should check day before time', () => {
        setMockTimeWithDay(8, 15, 0); // Sunday, within time range
        const subscription = createMockSubscription({
          activeTimeStart: '08:00',
          activeTimeEnd: '18:00',
          activeDays: '[1, 2, 3, 4, 5]', // Weekdays only
        });

        // Should return false because day check fails first
        expect(service.isWithinActiveTime(subscription)).toBe(false);
      });
    });

    describe('combined day and time filtering', () => {
      const setMockTimeWithDay = (
        hours: number,
        minutes: number,
        dayOfWeek: number,
      ) => {
        const baseDate = new Date(2024, 0, 7 + dayOfWeek, hours, minutes, 0);
        jest.useFakeTimers();
        jest.setSystemTime(baseDate);
      };

      it('should return true when both day and time match', () => {
        setMockTimeWithDay(8, 15, 1); // Monday 08:15
        const subscription = createMockSubscription({
          activeTimeStart: '08:00',
          activeTimeEnd: '08:30',
          activeDays: '[1]', // Monday only
        });

        expect(service.isWithinActiveTime(subscription)).toBe(true);
      });

      it('should return false when day matches but time does not', () => {
        setMockTimeWithDay(9, 0, 1); // Monday 09:00
        const subscription = createMockSubscription({
          activeTimeStart: '08:00',
          activeTimeEnd: '08:30',
          activeDays: '[1]', // Monday only
        });

        expect(service.isWithinActiveTime(subscription)).toBe(false);
      });

      it('should return false when time matches but day does not', () => {
        setMockTimeWithDay(8, 15, 0); // Sunday 08:15
        const subscription = createMockSubscription({
          activeTimeStart: '08:00',
          activeTimeEnd: '08:30',
          activeDays: '[1]', // Monday only
        });

        expect(service.isWithinActiveTime(subscription)).toBe(false);
      });
    });
  });

  describe('findActive', () => {
    it('should return only active subscriptions', async () => {
      const mockSubscriptions = [createMockSubscription()];
      (prismaService.subscription.findMany as jest.Mock).mockResolvedValue(
        mockSubscriptions,
      );

      const result = await service.findActive();

      expect(result).toEqual(mockSubscriptions);
      expect(prismaService.subscription.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
      });
    });
  });
});
