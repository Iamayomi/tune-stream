import { Controller, Get, Query } from '@nestjs/common';
import { PaymentService } from './payments.service';

@Controller('paypal')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get('success')
  async handleSuccess(@Query('token') orderId: string) {
    // ✅ Call PayPal API to verify the order
    const order = await this.paymentService.capturePaypalPayment(orderId);

    return { message: 'Payment successful', order };
  }

  @Get('cancel')
  handleCancel() {
    return { message: 'Payment was canceled' };
  }
}
