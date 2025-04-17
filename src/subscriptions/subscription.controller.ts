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
import { GuardRoute, Message } from 'src/library/decorator';
import { RoleAllowed } from 'src/library/decorator/role-allowed';
import { Roles } from 'src/library/types';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Message('subscription created successfully')
  @ApiOperation({
    summary: 'Admin Create Suscription plan',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.ADMIN)
  @GuardRoute()
  @Post('plans')
  async create(@Body() data: SubscriptionDto): Promise<Subscription> {
    return this.subscriptionService.createSubcription(data);
  }

  @Message('subscription plans Fetch successfully')
  @ApiOperation({
    summary: 'Fetch all Suscription plan',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get('plans')
  async getAllPlans(): Promise<Subscription[]> {
    return this.subscriptionService.getAllPlan();
  }

  @Message('subscription plan Fetch successfully')
  @ApiOperation({
    summary: 'Fetch a Suscription plan',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get('plans/:planId')
  async getAPlan(
    @Param('planId', ParseIntPipe) planId: number,
  ): Promise<Subscription> {
    return this.subscriptionService.getAPlan(planId);
  }

  @Message('subscription plan deleted successfully')
  @ApiOperation({
    summary: 'Admin Delete Suscription plan',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.ADMIN)
  @GuardRoute()
  @RoleAllowed(Roles.ADMIN)
  @GuardRoute()
  @Delete('plans/:planId')
  async delPlan(
    @Param('planId', ParseIntPipe) planId: number,
  ): Promise<DeleteResult> {
    return this.subscriptionService.delPan(planId);
  }

  @Message('payment subscription initiated successfully')
  @ApiOperation({ summary: 'initiate subscription payment' })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Post('plans/:subscriptionId/initiate-payment')
  async initiateUserSubscriptionPayment(
    @Req() req,
    @Param('subscriptionId', ParseIntPipe) subscriptionId: number,
  ) {
    // : Promise<PaymentOrderResponse>
    return this.subscriptionService.intiateUserSubscribe(req, subscriptionId);
  }

  @Message('payment subscription plan successfully')
  @ApiOperation({ summary: 'Verify subscription plan payment' })
  @Get('success')
  async handleSuccess(@Query('token') orderId: string) {
    return await this.subscriptionService.verifyUserSubscriptionPayment(
      orderId,
    );
  }

  @Message('payment subscription plan cancel')
  @ApiOperation({ summary: 'Cancel subscription plan payment' })
  @Get('cancel')
  handleCancel() {
    return { message: 'Payment was canceled' };
  }
}
