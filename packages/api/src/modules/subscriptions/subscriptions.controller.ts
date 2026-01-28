import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  DashboardResponseDto,
} from '@busnoti/shared';
import type { AuthUser } from '@busnoti/shared';
import { Subscription } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  /**
   * POST /subscriptions - Create a new subscription
   */
  @Post()
  async create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionsService.create({ ...dto, userId: user.id });
  }

  /**
   * GET /subscriptions/dashboard - Get dashboard data with arrival info
   */
  @Get('dashboard')
  async getDashboard(
    @CurrentUser() user: AuthUser,
  ): Promise<DashboardResponseDto> {
    return this.subscriptionsService.getDashboard(user.id);
  }

  /**
   * GET /subscriptions - Get current user's subscriptions
   */
  @Get()
  async findByUser(@CurrentUser() user: AuthUser): Promise<Subscription[]> {
    return this.subscriptionsService.findByUser(user.id);
  }

  /**
   * GET /subscriptions/:id - Get subscription by ID
   */
  @Get(':id')
  async findById(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionsService.findById(id);

    if (subscription.userId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return subscription;
  }

  /**
   * PATCH /subscriptions/:id - Update subscription
   */
  @Patch(':id')
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionsService.findById(id);

    if (subscription.userId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    const { userId: _userId, ...updateData } = dto;
    return this.subscriptionsService.update(id, updateData);
  }

  /**
   * DELETE /subscriptions/:id - Delete subscription
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<void> {
    const subscription = await this.subscriptionsService.findById(id);

    if (subscription.userId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return this.subscriptionsService.delete(id);
  }
}
