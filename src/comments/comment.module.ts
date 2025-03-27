import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { Comment } from './comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Song, User])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
