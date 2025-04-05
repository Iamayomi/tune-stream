import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateAlbumDTO {
  @ApiProperty({
    example: 'More love',
    description: 'Provide the album title',
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    example: 'afrobeats',
    description: 'Provide the album genre',
  })
  @IsString()
  @IsNotEmpty()
  readonly genre: string;

  @ApiProperty({
    example: 2,
    description: 'Provide the artist id',
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly artist: number;

  @ApiPropertyOptional({
    example: '2022-08-29',
    description: 'Provide album releaseDate',
  })
  @IsNotEmpty()
  @IsDateString()
  @IsString()
  @IsDateString()
  readonly releaseDate?: Date;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Cover image (jpg/png)',
  })
  cover?: any;
}
