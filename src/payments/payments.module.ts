import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from './payments.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [ConfigModule.forRoot(), PaymentModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
