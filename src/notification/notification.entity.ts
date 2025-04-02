import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationType } from './type';
import { User } from 'src/users/user.entity';
import { INotification } from './interface';

@Entity('notifications')
export class Notification implements INotification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'varchar', nullable: false })
  message: string;

  @Column({ name: 'isRead', default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.notifications, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, string>;

  @Column({ type: 'integer', nullable: false })
  userId: number;
}
