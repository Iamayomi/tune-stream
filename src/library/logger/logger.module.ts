import { Module } from '@nestjs/common';
import { CustomLogger } from './custmom.logger';

@Module({
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}
