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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GuardRoute, Message } from 'src/library/decorator';
import { Roles } from 'src/library/types';
import { RoleAllowed } from 'src/library/decorator/role-allowed';

@ApiBearerAuth('JWT-auth')
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Message('Notification Fetch successfully')
  @ApiOperation({
    summary: 'Get User Notification',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get(':userId')
  public async getUserNotifications(
    @Param('userId') userId: number,
    @Query()
    filterDto: FilterNotificationDto,
  ): Promise<Notification[]> {
    return this.notificationService.getUserNotifications(userId, filterDto);
  }

  @Message(' Unread Notification Fetch successfully')
  @ApiOperation({
    summary: 'Get User Unread Notification',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get(':userId/unread-count')
  public async getUnreadNotificationCount(
    @Param('userId') userId: number,
  ): Promise<{ count: number }> {
    const count =
      await this.notificationService.getUnreadNotificationCount(userId);
    return { count };
  }

  @Message(' Notification Mark Read successfully')
  @ApiOperation({
    summary: 'Get User Unread Notification',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Patch(':notificationId/read')
  async markNotificationAsRead(
    @Param('notificationId') notificationId: number,
  ): Promise<Notification> {
    return this.notificationService.markNotificationAsRead(notificationId);
  }

  @Message('Mark All Notification Read successfully')
  @ApiOperation({
    summary: 'Get User Unread Notification',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Patch(':userId/read-all')
  async markAllNotificationsAsRead(
    @Param('userId') userId: number,
  ): Promise<void> {
    return this.notificationService.markAllNotificationsAsRead(userId);
  }

  @Message('Notification Deleted successfully')
  @ApiOperation({
    summary: 'Delete Notification',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Delete(':notificationId')
  async deleteNotification(
    @Param('notificationId') notificationId: number,
  ): Promise<void> {
    return this.notificationService.deleteNotification(notificationId);
  }
}
