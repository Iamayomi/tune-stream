import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FollowService } from './follow.service';
import { User } from 'src/users/user.entity';
import { Artist } from 'src/artists/artist.entity';
import { Album } from 'src/albums/album.entity';
import { FollowController } from './follow.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Artist, Album])],
  providers: [FollowService],
  controllers: [FollowController],
})
export class FollowModule {}
