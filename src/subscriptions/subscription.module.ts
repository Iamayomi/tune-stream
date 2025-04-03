import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './subscription.entity';
import { User } from 'src/users/user.entity';
import { PaymentModule } from 'src/payments/payments.module';
import { Transaction } from 'src/payments/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Subscription, Transaction]),
    PaymentModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
