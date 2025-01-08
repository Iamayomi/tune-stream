import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Playlist } from '../playlists/playlist.entity';



@Module({
  imports: [TypeOrmModule.forFeature([User, Playlist])],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
