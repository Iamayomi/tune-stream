import { Module } from '@nestjs/common';
import { ArtistsService } from './artist.service';
import { ArtistsController } from './artist.controller';
import { Artist } from './artist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/module/users/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Artist, User])],
  providers: [ArtistsService],
  controllers: [ArtistsController],
  exports: [ArtistsService]
})
export class ArtistsModule {}
