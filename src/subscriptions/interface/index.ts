import { User } from 'src/users/user.entity';
import { BILLING_CYCLE, SUBSCRIPTION_PLAN } from '../type';

export interface ISubscription {
  /** subscription's id */
  id: number;

  /** subscription's plan */
  plan: SUBSCRIPTION_PLAN;

  /** subscription's price */
  price: number;

  /** subscription's ad support */
  isAdSupported: boolean;

  /** subscription's date started */
  subscribedAt: Date;

  /** subscription's date expired */
  expiresAt: Date;

  /** subscription's active */
  isActive: boolean;

  /** subscription's discount */
  discount: string;

  /** subscription's users max */
  maxUsers: number;

  /** subscription's description */
  description: string;

  /** subscription's billing cycle */
  billingCycle: BILLING_CYCLE;

  /** subscription's user's owner id */
  ownerUsererId: User;
}
