import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';

export class SubscriptionDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  subscriptionId: string;

  @ApiProperty({ example: 'free', enum: ['free', 'monthly', 'annual'] })
  @IsEnum(['free', 'monthly', 'annual'])
  plan: 'free' | 'monthly' | 'annual';

  @ApiProperty({ example: '2024-02-22T12:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  subscribedAt?: string;

  @ApiProperty({ example: '2024-12-22T12:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  active: boolean;

  @ApiProperty({ example: 'BLACKFRIDAY2024', required: false })
  @IsOptional()
  discount?: string;
}

export class UpdateUserSubscriptionDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: SubscriptionDto, required: false })
  @IsOptional()
  subscription?: SubscriptionDto;
}
