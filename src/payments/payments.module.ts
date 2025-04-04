import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from './payments.service';

@Module({
  imports: [ConfigModule.forRoot(), PaymentModule],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
