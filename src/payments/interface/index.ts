import { CURRENCY, PAYMENT_TYPE } from '../types';

export class ITransaction {
  /** Transaction's id */
  id: string;

  /** Transaction's ref */
  ref: string;

  /** Transaction's amount */
  amount: number;

  /** Transaction's customer Id */
  customerId: number;

  /** Transaction's currency */
  currency: CURRENCY;

  /** Transaction's subscriptionId */
  subscriptionId?: number;

  subscriptionPlan?: string;

  /** Transaction's payment type */
  type: PAYMENT_TYPE;

  /** Transaction's status */
  status: boolean;

  /** Transaction's Date initiated*/
  initiatedAt?: Date;

  /** Transaction's Date initiated*/
  completedAt?: Date;
}
