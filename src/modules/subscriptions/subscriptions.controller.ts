import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from '@prisma/client';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  /**
   * POST /subscriptions - Create a new subscription
   */
  @Post()
  async create(@Body() dto: CreateSubscriptionDto): Promise<Subscription> {
    return this.subscriptionsService.create(dto);
  }

  /**
   * GET /subscriptions?userId=xxx - Get user's subscriptions
   */
  @Get()
  async findByUser(@Query('userId') userId: string): Promise<Subscription[]> {
    return this.subscriptionsService.findByUser(userId);
  }

  /**
   * GET /subscriptions/:id - Get subscription by ID
   */
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Subscription> {
    return this.subscriptionsService.findById(id);
  }

  /**
   * PATCH /subscriptions/:id - Update subscription
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionsService.update(id, dto);
  }

  /**
   * DELETE /subscriptions/:id - Delete subscription
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.subscriptionsService.delete(id);
  }
}
