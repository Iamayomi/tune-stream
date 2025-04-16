import {
  IsInt,
  Min,
  Max,
  IsOptional,
  IsEnum,
  IsMilitaryTime,
  IsNotEmpty,
} from 'class-validator';
import { RepeatMode } from '../type';
import { ApiProperty } from '@nestjs/swagger';

export class PlaybackActionDTO {
  @IsInt()
  @IsOptional()
  songId?: number;

  @IsInt()
  @IsOptional()
  userId?: number;

  @IsInt()
  @IsOptional()
  socketId?: number;

  @ApiProperty({
    example: '02:34',
    description: 'Provide the playback duration',
  })
  @IsNotEmpty()
  @IsMilitaryTime()
  @IsOptional()
  readonly position?: Date;

  @IsInt()
  @Min(0)
  @IsOptional()
  queueIndex?: number;

  @IsEnum(RepeatMode)
  @IsOptional()
  repeat?: RepeatMode;
}
