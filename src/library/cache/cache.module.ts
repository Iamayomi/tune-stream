import { Global, Inject, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { Keyv, createKeyv } from '@keyv/redis';
import { CACHE_INSTANCE, REDIS_CLOUD_URL, TIME_IN } from '../config';
import { ConfigService } from '@nestjs/config';
import KeyvGzip from '@keyv/compress-gzip';
import { Cacheable, CacheableMemory } from 'cacheable';

@Global()
@Module({
  providers: [
    {
      provide: CACHE_INSTANCE,
      useFactory: async (config: ConfigService) => {
        const primary = createKeyv(
          config.get(REDIS_CLOUD_URL, 'redis://127.0.0.1:6379'),
        );

        const secondary = new Keyv({
          store: new CacheableMemory({ lruSize: 10000 }),
          compression: new KeyvGzip(),
        });

        return new Cacheable({ primary, secondary, ttl: TIME_IN.days[1] });
      },
      inject: [ConfigService],
    },
    CacheService,
  ],
  exports: [CACHE_INSTANCE, CacheService],
})
export class CacheModule {}
