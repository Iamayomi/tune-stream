import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { SongGenre } from '../types';
import { Type } from 'class-transformer';

export class SearchSongDto {
  @ApiProperty({ example: 'tryme', description: 'Provide the search query' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({
    example: 'popularity',
    description: 'Sort by field',
  })
  @IsOptional()
  @IsString()
  sortBy?: 'popularity' | 'releaseDate';

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Sort order',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of results per page',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  // Filters with explicit property types
  @ApiPropertyOptional({
    example: { genre: 'hip-hop', artist: 'Drake' },
    description: 'Filters for various song attributes',
    type: Object,
  })
  @IsOptional()
  filters?: {
    genre?: SongGenre;
    artist?: string;
    album?: string;
    popularity?: number;
  };

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
