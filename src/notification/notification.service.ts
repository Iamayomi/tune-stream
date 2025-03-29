import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationDto, FilterNotificationDto } from './dto';
import { FirebaseService } from '../library/firebase/firebase.service';
import { User } from '../users/user.entity';
import { NotificationType } from './type';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private firebaseService: FirebaseService,
  ) {}

  private getNotificationTitle(type: NotificationType): string {
    const titles = {
      [NotificationType.NEW_MUSIC]: 'New Music Alert',
      [NotificationType.PLAYLIST_UPDATE]: 'Playlist Update',
      [NotificationType.FRIEND_ACTIVITY]: 'Friend Activity',
      [NotificationType.SUBSCRIPTION]: 'Subscription Notification',
      [NotificationType.LISTENING_ACTIVITY]: 'Listening Activity',
      [NotificationType.SYSTEM_UPDATE]: 'System Update',
    };
    return titles[type] || 'Notification';
  }

  public async createNotification(
    dto: CreateNotificationDto,
  ): Promise<Notification> {
    // Verify user exists

    const user = await this.userRepository.findOneBy({ id: dto.userId });

    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    // Create notification
    const notification = this.notificationRepository.create({
      ...dto,
      user,
    });

    await this.notificationRepository.save(notification);

    // Send Firebase push notification
    await this.firebaseService.sendPushNotification({
      title: this.getNotificationTitle(dto.type),
      body: dto.message,
      userId: dto.userId,
      data: {
        notificationId: notification.id,
        type: notification.type,
        // relatedEntityId: notification.relatedEntityId || '',
      },
    });

    return notification;
  }

  public async markNotificationAsRead(
    notificationId: number,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException(
        `Notification with ID ${notificationId} not found`,
      );
    }

    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  public async getUserNotifications(
    userId: number,
    filterDto: FilterNotificationDto,
  ): Promise<Notification[]> {
    const { type, isRead, limit = 50, offset = 0 } = filterDto;

    const findOptions: FindManyOptions<Notification> = {
      where: {
        userId,
        ...(type ? { type } : {}),
        ...(isRead !== undefined ? { isRead } : {}),
      },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
      relations: ['user'],
    };

    return this.notificationRepository.find(findOptions);
  }

  public async markAllNotificationsAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  public async deleteNotification(notificationId: number): Promise<void> {
    const result = await this.notificationRepository.delete(notificationId);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Notification with ID ${notificationId} not found`,
      );
    }
  }

  public async getUnreadNotificationCount(userId: number): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }
}
