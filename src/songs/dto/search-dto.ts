import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  isEnum,
  IsEnum,
} from 'class-validator';
import { SongGenre } from '../types';
import { Type } from 'class-transformer';

export class SearchDto {
  @ApiPropertyOptional({
    example: 'tryme',
    description:
      'Provide the search query to search for songs, artists, or albums.',
    required: false,
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  song?: string;

  @ApiPropertyOptional({
    example: 'made in lagos',
    description: 'field to search album.name.',
    required: false,
  })
  @IsOptional()
  @IsString()
  album?: string;

  @ApiPropertyOptional({
    example: 'wizkid',
    description: 'field to search artist.name.',
    required: false,
  })
  @IsOptional()
  @IsString()
  artist?: string;

  @ApiProperty({
    example: 'popularity',
    description: 'Sort by field',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: 'popularity' | 'releaseDate';

  @ApiPropertyOptional({
    example: 'afrobeats',
    description: 'field to search song genre .',
    required: false,
  })
  @IsOptional()
  @IsEnum(SongGenre)
  @IsString()
  genre?: SongGenre;

  @ApiPropertyOptional({
    example: 'my playlist',
    description: 'field to search playlist.name.',
    required: false,
  })
  @IsOptional()
  @IsString()
  playlist: string;

  @ApiPropertyOptional({
    example: 'desc',
    description:
      'Sort order for the results. Can be "asc" for ascending or "desc" for descending.',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination. Default is 1.',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of results per page for pagination. Default is 10.',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 0,
    description: 'Offset for pagination, used for skipping records.',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;
}
