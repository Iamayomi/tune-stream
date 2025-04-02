import { User } from 'src/users/user.entity';
import { NotificationType } from '../type';

export interface INotification {
  /** Notification's id */
  id: number;

  /** Notification's type */
  type: NotificationType;

  /** Notification's message */
  message: string;

  /** Notification's isread */
  isRead: boolean;

  /** Notification's date created */
  createdAt: Date;

  /** Notification's isread */
  user: User;

  /** Notification's data */
  data?: Record<string, string>;

  /** Notification's user id */
  userId: number;
}
