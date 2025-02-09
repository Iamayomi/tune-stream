import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [SearchService]
})
export class SearchModule {}
