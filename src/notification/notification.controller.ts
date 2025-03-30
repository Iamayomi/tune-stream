import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';
import { FilterNotificationDto } from './dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ProtectUser } from 'src/library/decorator';

@ApiBearerAuth('JWT-auth')
@ProtectUser()
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get(':userId')
  public async getUserNotifications(
    @Param('userId') userId: number,
    @Query()
    filterDto: FilterNotificationDto,
  ): Promise<Notification[]> {
    return this.notificationService.getUserNotifications(userId, filterDto);
  }

  @Get(':userId/unread-count')
  public async getUnreadNotificationCount(
    @Param('userId') userId: number,
  ): Promise<{ count: number }> {
    const count =
      await this.notificationService.getUnreadNotificationCount(userId);
    return { count };
  }

  @Patch(':notificationId/read')
  async markNotificationAsRead(
    @Param('notificationId') notificationId: number,
  ): Promise<Notification> {
    return this.notificationService.markNotificationAsRead(notificationId);
  }

  @Patch(':userId/read-all')
  async markAllNotificationsAsRead(
    @Param('userId') userId: number,
  ): Promise<void> {
    return this.notificationService.markAllNotificationsAsRead(userId);
  }

  @Delete(':notificationId')
  async deleteNotification(
    @Param('notificationId') notificationId: number,
  ): Promise<void> {
    return this.notificationService.deleteNotification(notificationId);
  }
}
