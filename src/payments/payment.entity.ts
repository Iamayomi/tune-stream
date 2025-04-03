import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ITransaction } from './interface';
import { CURRENCY, PAYMENT_TYPE } from './types';

@Entity('transaction')
export class Transaction implements ITransaction {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  ref: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  customerId: number;

  @Column({ type: 'enum', enum: CURRENCY, default: 'USD' })
  currency: CURRENCY;

  @Column({ nullable: true })
  subscriptionId?: number;

  @Column({ nullable: true })
  subscriptionPlan?: string;

  @Column({ type: 'enum', enum: PAYMENT_TYPE })
  type: PAYMENT_TYPE;

  @Column({ default: false })
  status: boolean;

  @CreateDateColumn({ name: 'initiatedAt' })
  initiatedAt?: Date;

  @UpdateDateColumn({ name: 'completedAt' })
  completedAt?: Date;
}
