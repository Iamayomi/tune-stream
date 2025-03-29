import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { FirebaseService } from '../library/firebase/firebase.service';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Notification])],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway, FirebaseService],
  exports: [NotificationService],
})
export class NotificationModule {}
