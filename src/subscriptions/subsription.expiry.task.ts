import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionService } from './subscription.service';
import { UserService } from '../users/user.service';

@Injectable()
export class SubscriptionExpiryTask {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly userService: UserService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async checkExpirations() {
    const expiredSubs = await this.subscriptionService.findExpiredSubscrition();

    for (const sub of expiredSubs) {
      await this.subscriptionService.markAsExpiredSubscription(sub);
      await this.userService.downgradeToFree(sub.user);
    }
  }
}
