import { Module } from '@nestjs/common';
import { ArtistsService } from './artist.service';
import { ArtistsController } from './artist.controller';
import { Artist } from './artist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UserModule } from '../users/user.module';
import { Stream } from 'src/stream/stream.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, User, Stream]), UserModule],
  providers: [ArtistsService],
  controllers: [ArtistsController],
  exports: [ArtistsService],
})
export class ArtistsModule {}
