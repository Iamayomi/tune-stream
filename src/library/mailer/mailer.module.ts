import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mailer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_NAME, GOOGLE_AUTH_PASSWORD, GOOGLE_AUTH_USER } from '../config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get<string>(GOOGLE_AUTH_USER),
            pass: configService.get<string>(GOOGLE_AUTH_PASSWORD),
          },
        },
        defaults: {
          from: `${APP_NAME} <${GOOGLE_AUTH_USER}>`,
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
