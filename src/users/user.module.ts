import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Playlist } from '../playlists/playlist.entity';
import { MailModule } from '../library/mailer/mailer.module';
import { CustomLogger } from 'src/library';
import { CloudinaryModule } from 'src/library/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Playlist]),
    MailModule,
    CloudinaryModule,
  ],
  controllers: [UserController],
  providers: [UserService, CustomLogger],
  exports: [UserService],
})
export class UserModule {}
