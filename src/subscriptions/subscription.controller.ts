import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

import { SubscriptionService } from './subscription.service';
import { SubscriptionDto } from './dto';
import { Subscription } from './subscription.entity';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  //   @ApiBearerAuth('JWT-auth')
  @Post('plans')
  async create(@Body() data: SubscriptionDto): Promise<Subscription> {
    return this.subscriptionService.createSubcription(data);
  }

  @Get('plans')
  async getAllPlans(): Promise<Subscription[]> {
    return this.subscriptionService.getAllPlan();
  }

  @Get('plans/:planId')
  async getAPlan(
    @Param('planId', ParseIntPipe) planId: number,
  ): Promise<Subscription> {
    return this.subscriptionService.getAPlan(planId);
  }

  @Delete('plans/:planId')
  async delPlan(
    @Param('planId', ParseIntPipe) planId: number,
  ): Promise<DeleteResult> {
    return this.subscriptionService.delPan(planId);
  }
}
