import {
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { NotificationType } from '../type';
import { Type } from 'class-transformer';

export class CreateNotificationDto {
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export class FilterNotificationDto {
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
