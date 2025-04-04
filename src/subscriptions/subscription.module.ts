import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './subscription.entity';
import { User } from 'src/users/user.entity';
import { PaymentModule } from 'src/payments/payments.module';
import { Transaction } from 'src/payments/payment.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { SubscriptionExpiryTask } from './subsription.expiry.task';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Subscription, Transaction]),
    UserModule,
    PaymentModule,
    NotificationModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionExpiryTask],
})
export class SubscriptionModule {}
