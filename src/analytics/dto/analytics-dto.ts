import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { TimeFrame } from 'src/library/types';

export class AnalyticsFilterDto {
  @ApiProperty({
    example: 'day',
    description: 'field to search stats day, month, year .',
    required: false,
  })
  @IsOptional()
  @IsString()
  period?: TimeFrame;

  @ApiProperty({
    example: 23,
    description: 'provide user id.',
    required: false,
  })
  @IsOptional()
  @IsInt()
  userId?: number;
}
