import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TimeFrame } from 'src/library/types';

export class StatsDTO {
  @ApiProperty({
    example: 'day',
    description: 'field to search stats day, month, year .',
    required: false,
  })
  @IsOptional()
  @IsString()
  time?: TimeFrame;
}
