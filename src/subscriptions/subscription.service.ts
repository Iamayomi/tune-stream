import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, LessThan, Repository } from 'typeorm';

import { Subscription } from './subscription.entity';
import { SubscriptionDto } from './dto';
import { User } from 'src/users/user.entity';
import { PaymentService } from 'src/payments/payments.service';
import { addMonths, addYears, formatDistanceToNow } from 'date-fns';
import { generateUUID } from 'src/library';
import { PAYMENT_TYPE } from 'src/payments/types';
import { Transaction } from 'src/payments/payment.entity';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/type';

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

    private notificationService: NotificationService,
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

  public async findExpiredSubscrition(): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: {
        expiresAt: LessThan(new Date()),
        status: 'active',
      },
      relations: ['user'],
    });
  }

  public async markAsExpiredSubscription(data: Subscription) {
    data.status = 'expired';
    await this.subscriptionRepository.save(data);
  }

  public async intiateUserSubscribe(@Req() req, subscriptionId: number) {
    const userId = req.user.id;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subscriptions'],
    });

    if (!user)
      throw new NotFoundException(`User with this ID ${userId} not found`);

    if (user.subscriptions && user.subscriptions.status === 'active')
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

    let discount: number;

    const transac = await this.transactionRepository.findOne({
      where: { customerId: userId },
    });

    if (!transac.status) discount = plan.discount * plan.price;

    if (user.promoCode) discount = plan.discount * plan.price;

    const price = discount || plan.price;

    const tex_ref = await generateUUID(8);

    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: tex_ref,
          amount: { currency_code: 'USD', value: price },
        },
      ],
      invoice_id: tex_ref,
      application_context: {
        brand_name: 'tunestream',
        landing_page: 'BILLING', // Forces the payment page instead of login
        user_action: 'PAY_NOW',
        return_url: 'http://localhost:8080/api/v1/subscriptions/success',
        cancel_url: 'http://localhost:8080/api/v1/subscriptions/cancel',
      },
    };

    const paymentUrl = await this.paymentService.InitialPaypalPayment(payload);

    const transaction = this.transactionRepository.create({
      ref: tex_ref,
      amount: price,
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

  // Verify Payment
  public async verifyUserSubscriptionPayment(orderId: string) {
    const response = await this.paymentService.capturePaypalPayment(orderId);

    const res = response.purchase_units.map(
      (val: { reference_id: any }) => val.reference_id,
    );

    const tex_ref = res.find((val: any) => val);

    const { status } = response;

    if (status === 'COMPLETED') {
      const transaction = await this.transactionRepository.findOne({
        where: { ref: tex_ref },
      });

      if (transaction.status)
        throw new ConflictException(
          'This transaction has already been approved',
        );

      transaction.ref = orderId;
      transaction.status = true;
      await this.transactionRepository.save(transaction);

      const today = new Date(Date.now());

      const user = await this.userRepository.findOne({
        where: { id: transaction.customerId },
        relations: ['subscriptions'],
      });

      const subscription = await this.subscriptionRepository.findOne({
        where: { id: transaction.subscriptionId },
      });

      let expiresAt: Date | null = null;

      if (subscription.billingCycle === 'monthly') {
        expiresAt = addMonths(today, 1);
      }

      if (subscription.billingCycle === 'yearly') {
        expiresAt = addYears(today, 1);
      }

      const data = {
        status: 'active',
        isAdSupported: subscription.isAdSupported,
        billingCycle: subscription.billingCycle,
        maxUsers: subscription.maxUsers,
        expiresAt: expiresAt,
        subscribedAt: today,
      };
      user.isPremium = true;
      user.subscription = subscription.plan;
      await this.userRepository.save(user);

      await this.notificationService.createNotification({
        type: NotificationType.SUBSCRIPTION,
        message: `User ${user.id} successfully subscribed.`,
        data: user.subscriptions,
        userId: user.id,
      });

      return {
        success: true,
        message: 'Subscription payment completed successfully.',
        transaction,
      };
    } else {
      const failedTransaction = await this.transactionRepository.findOne({
        where: { ref: tex_ref },
      });

      if (failedTransaction) {
        failedTransaction.status = false;
        await this.transactionRepository.save(failedTransaction);
      }

      await this.notificationService.createNotification({
        type: NotificationType.SUBSCRIPTION,
        message: `Payment failed for subscription plan.`,
        data: { orderId, status },
        userId: failedTransaction?.customerId || 0,
      });

      throw new BadRequestException({
        message:
          'Payment was not successful. Please try again or use a different method.',
        errorCode: 'PAYMENT_FAILED',
        status,
      });
    }
  }
}
