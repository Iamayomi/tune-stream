import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SongGenre } from '../types';

export class UploadSongDto {
  @ApiProperty({
    example: 'try me',
    description: 'Provide the song title',
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiPropertyOptional({
    example: '1',
    description: 'Provide the album id ',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly album?: number;

  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'List of artist IDs',
  })
  @IsArray()
  @Transform(({ value }) => {
    // Handle cases where value might be sent as a string
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return [Number(value)];
      }
    }
    // Handle case where value might be a single number
    if (typeof value === 'number') {
      return [value];
    }
    return value;
  })
  @Type(() => Number)
  @IsNumber({}, { each: true })
  artists?: number[];

  @ApiProperty({
    example: '2022-08-29',
    description: 'Provide the releaseDate',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly releaseDate: Date;

  @IsEnum(SongGenre)
  @IsString()
  @IsNotEmpty()
  readonly genre: SongGenre;

  @ApiProperty({
    example: '02:34',
    description: 'Provide the song duration',
  })
  @IsNotEmpty()
  @IsMilitaryTime()
  readonly duration: Date;

  @ApiPropertyOptional({
    example: 5,
    description: 'Provide the song popularity',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  popularity?: number;

  @ApiProperty({
    example:
      "by, you're my adrenaline. Brought out this other side of me You don't",
    description: 'Provide the song lyrics',
  })
  @IsString()
  @IsOptional()
  readonly lyrics: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Audio file (mp3, etc.)',
  })
  audio: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Cover image (jpg/png)',
  })
  cover: any;
}
