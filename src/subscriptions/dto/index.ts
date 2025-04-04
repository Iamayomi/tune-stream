import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsUUID,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  Max,
  Min,
  IsString,
} from 'class-validator';
import { BILLING_CYCLE, SUBSCRIPTION_PLAN } from '../type';

export class SubscriptionDto {
  @ApiProperty({ example: 'Free', enum: SUBSCRIPTION_PLAN })
  @IsEnum(SUBSCRIPTION_PLAN)
  plan: SUBSCRIPTION_PLAN;

  @ApiProperty({ example: 3.5, required: false })
  @IsNumber()
  @Min(0.0)
  price: number;

  @ApiProperty({
    example: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isAdSupported?: boolean;

  @ApiProperty({ example: 3, required: false })
  @IsNumber()
  @Min(1)
  @Max(10)
  maxUser: number;

  @ApiProperty({ example: 0.5, required: false })
  @IsNumber()
  @Min(0.0)
  discount?: number;

  @ApiProperty({ example: 'monthly', required: false })
  @IsEnum(BILLING_CYCLE)
  billingCycle: BILLING_CYCLE;
}

export class UpdateUserSubscriptionDto extends PartialType(SubscriptionDto) {
  @ApiProperty({ example: '2024-02-22T12:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  subscribedAt?: string;

  @ApiProperty({ example: '2024-12-22T12:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: '2', required: false })
  @IsString()
  ownerUsererId: string;
}
