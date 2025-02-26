import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('subscription')
export class Subscription {
  //   @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn()
  subscriptionId: string;

  @Column({ type: 'enum', enum: ['free', 'monthly', 'annual'] })
  plan: 'free' | 'monthly' | 'annual';

  @CreateDateColumn({ type: 'timestamptz' })
  subscribedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @Column({ type: 'varchar', nullable: true })
  discount: string;

  @ManyToOne(() => User, (user) => user.subscription, { onDelete: 'CASCADE' })
  user: User;
}
