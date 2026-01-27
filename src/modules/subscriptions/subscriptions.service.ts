import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../domain';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  /**
   * Create a new subscription
   */
  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    this.logger.debug(`Creating subscription for user: ${dto.userId}`);

    const subscription = this.subscriptionRepository.create({
      userId: dto.userId,
      region: dto.region,
      stationId: dto.stationId,
      routeId: dto.routeId,
      staOrder: dto.staOrder,
      leadTimeMinutes: dto.leadTimeMinutes,
      channels: JSON.stringify(dto.channels),
      activeTimeStart: dto.activeTimeStart,
      activeTimeEnd: dto.activeTimeEnd,
      activeDays: dto.activeDays ? JSON.stringify(dto.activeDays) : undefined,
      isActive: true,
    });

    const saved = await this.subscriptionRepository.save(subscription);
    this.logger.log(`Created subscription ${saved.id} for user: ${dto.userId}`);
    return saved;
  }

  /**
   * Find all subscriptions for a user
   */
  async findByUser(userId: string): Promise<Subscription[]> {
    this.logger.debug(`Finding subscriptions for user: ${userId}`);
    return this.subscriptionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find subscription by ID
   */
  async findById(id: string): Promise<Subscription> {
    this.logger.debug(`Finding subscription by ID: ${id}`);
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return subscription;
  }

  /**
   * Find all active subscriptions (for scheduler)
   */
  async findActive(): Promise<Subscription[]> {
    this.logger.debug('Finding all active subscriptions');
    return this.subscriptionRepository.find({
      where: { isActive: true },
    });
  }

  /**
   * Update a subscription
   */
  async update(id: string, dto: UpdateSubscriptionDto): Promise<Subscription> {
    this.logger.debug(`Updating subscription: ${id}`);

    // Verify subscription exists before updating
    await this.findById(id);

    // Build update object
    const updateData: Partial<Subscription> = {};

    if (dto.userId !== undefined) updateData.userId = dto.userId;
    if (dto.region !== undefined) updateData.region = dto.region;
    if (dto.stationId !== undefined) updateData.stationId = dto.stationId;
    if (dto.routeId !== undefined) updateData.routeId = dto.routeId;
    if (dto.staOrder !== undefined) updateData.staOrder = dto.staOrder;
    if (dto.leadTimeMinutes !== undefined)
      updateData.leadTimeMinutes = dto.leadTimeMinutes;
    if (dto.channels !== undefined)
      updateData.channels = JSON.stringify(dto.channels);
    if (dto.activeTimeStart !== undefined)
      updateData.activeTimeStart = dto.activeTimeStart;
    if (dto.activeTimeEnd !== undefined)
      updateData.activeTimeEnd = dto.activeTimeEnd;
    if (dto.activeDays !== undefined)
      updateData.activeDays = JSON.stringify(dto.activeDays);
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    await this.subscriptionRepository.update(id, updateData);

    this.logger.log(`Updated subscription: ${id}`);
    return this.findById(id);
  }

  /**
   * Delete a subscription
   */
  async delete(id: string): Promise<void> {
    this.logger.debug(`Deleting subscription: ${id}`);

    // Verify subscription exists before deleting
    await this.findById(id);
    await this.subscriptionRepository.delete(id);

    this.logger.log(`Deleted subscription: ${id}`);
  }

  /**
   * Check if current time is within the subscription's active time window
   */
  isWithinActiveTime(subscription: Subscription): boolean {
    const now = new Date();
    const currentDay = now.getDay(); // 0-6 (Sunday to Saturday)

    // Check active days
    if (subscription.activeDays) {
      const activeDays = JSON.parse(subscription.activeDays) as number[];
      if (activeDays.length > 0 && !activeDays.includes(currentDay)) {
        this.logger.debug(
          `Subscription ${subscription.id} not active on day ${currentDay}`,
        );
        return false;
      }
    }

    // Check active time window
    if (subscription.activeTimeStart && subscription.activeTimeEnd) {
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const start = subscription.activeTimeStart;
      const end = subscription.activeTimeEnd;

      // Handle overnight time ranges (e.g., 22:00 - 06:00)
      if (start <= end) {
        // Normal range (e.g., 08:00 - 18:00)
        if (currentTime < start || currentTime > end) {
          this.logger.debug(
            `Subscription ${subscription.id} not active at time ${currentTime} (window: ${start}-${end})`,
          );
          return false;
        }
      } else {
        // Overnight range (e.g., 22:00 - 06:00)
        if (currentTime < start && currentTime > end) {
          this.logger.debug(
            `Subscription ${subscription.id} not active at time ${currentTime} (overnight window: ${start}-${end})`,
          );
          return false;
        }
      }
    }

    return true;
  }
}
