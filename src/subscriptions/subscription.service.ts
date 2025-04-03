import {
  ConflictException,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { Subscription } from './subscription.entity';
import { SubscriptionDto } from './dto';
import { User } from 'src/users/user.entity';
import { PaymentService } from 'src/payments/payments.service';
import { formatDistanceToNow } from 'date-fns';
import { generateUUID } from 'src/library';
import { PAYMENT_TYPE } from 'src/payments/types';
import { Transaction } from 'src/payments/payment.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    private paymentService: PaymentService,
  ) {}

  public async createSubcription(data: SubscriptionDto): Promise<Subscription> {
    const planExists = await this.subscriptionRepository.findOne({
      where: { plan: data.plan },
    });

    if (planExists) throw new ConflictException('plan has already exist');

    const subscription = this.subscriptionRepository.create(data);

    return this.subscriptionRepository.save(subscription);
  }

  public async getAllPlan(): Promise<Subscription[]> {
    return this.subscriptionRepository.find();
  }

  public async delPan(planId: number): Promise<DeleteResult> {
    const plan = await this.subscriptionRepository.findOne({
      where: { id: planId },
    });
    if (!plan)
      throw new NotFoundException(`Plan with this ID ${planId} not found`);

    return await this.subscriptionRepository.delete(planId);
  }

  public async getAPlan(planId: number): Promise<Subscription> {
    const plan = await this.subscriptionRepository.findOne({
      where: { id: planId },
    });
    if (!plan)
      throw new NotFoundException(`Plan with this ID ${planId} not found`);

    return plan;
  }

  public async intiateUserSubscribe(@Req() req, subscriptionId: number) {
    const userId = req.user.id;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subscriptions'],
    });

    if (!user)
      throw new NotFoundException(`User with this ID ${userId} not found`);

    if (user.subscriptions && user.subscriptions.isActive)
      throw new ConflictException(
        `You already have an active subscription plan which expires in ${formatDistanceToNow(user.subscriptions.expiresAt)}`,
      );

    const plan = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
    });

    if (!plan)
      throw new NotFoundException(
        `Plan with this ID ${subscriptionId} not found`,
      );

    const payload = {
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: 'USD', value: plan.price } }],
      application_context: {
        brand_name: 'tunestream',
        landing_page: 'BILLING', // ✅ Forces the payment page instead of login
        user_action: 'PAY_NOW', // ✅ Shows "Pay Now" button directly
        return_url: 'http://localhost:8080/api/v1/paypal/success',
        cancel_url: 'http://localhost:8080/api/v1/paypal/cancel',
      },
    };

    const paymentUrl = await this.paymentService.InitialPaypalPayment(payload);

    const tex_ref = await generateUUID(8);

    const transaction = this.transactionRepository.create({
      ref: tex_ref,
      amount: plan.price,
      customerId: user.id,
      subscriptionId: plan.id,
      subscriptionPlan: plan.plan,
      type: PAYMENT_TYPE.SUBSCRIPTION,
      status: false,
      initiatedAt: new Date(),
    });

    await this.transactionRepository.save(transaction);

    return {
      success: true,
      message: 'Redirect to the provided url to complete checkout',
      paymentUrl,
    };
  }
}
