import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

import { SubscriptionService } from './subscription.service';
import { SubscriptionDto } from './dto';
import { Subscription } from './subscription.entity';
import { IntiatePaymentDto } from 'src/payments/dto';
import { ProtectUser } from 'src/library/decorator';

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

  @ApiOperation({ summary: 'initiate subscription payment' })
  @ApiBearerAuth('JWT-auth')
  @ProtectUser()
  @Post('plans/:subscriptionId/initiate-payment')
  async initiateUserSubscriptionPayment(
    @Req() req,
    @Param('subscriptionId', ParseIntPipe) subscriptionId: number,
  ) {
    // : Promise<PaymentOrderResponse>
    return this.subscriptionService.intiateUserSubscribe(req, subscriptionId);
  }

  @Get('success')
  async handleSuccess(@Query('token') orderId: string) {
    return await this.subscriptionService.verifyUserSubscriptionPayment(
      orderId,
    );
  }

  @Get('cancel')
  handleCancel() {
    return { message: 'Payment was canceled' };
  }
}
