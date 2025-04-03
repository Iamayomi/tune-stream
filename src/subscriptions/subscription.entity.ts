import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { BILLING_CYCLE, SUBSCRIPTION_PLAN } from './type';
import { ISubscription } from './interface';

@Entity('subscription')
export class Subscription implements ISubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: SUBSCRIPTION_PLAN,
    unique: true,
  })
  plan: SUBSCRIPTION_PLAN;

  @Column({ type: 'decimal', default: 0.0, scale: 2 })
  price: number;

  @Column({ type: 'boolean', default: false })
  isAdSupported: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  subscribedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  discount: string;

  @Column({ type: 'integer', default: 1 })
  maxUsers: number;

  @Column({ type: 'varchar', enum: BILLING_CYCLE })
  billingCycle: BILLING_CYCLE;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToOne(() => User, (user) => user.subscriptions, { onDelete: 'CASCADE' })
  user: User;
}
