import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';

export class SearchSongDto {
  @ApiProperty({ example: 'tryme', description: 'Provide the search query' })
  @IsNotEmpty()
  // @IsOptional()
  @IsString()
  query: string;

  @ApiProperty({
    example: 'popularity',
    description: 'Sort by field',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: 'popularity' | 'releaseDate';

  @ApiProperty({
    example: 'desc',
    description: 'Sort order',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';

  @ApiProperty({
    example: 1,
    description: 'Page number for pagination',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Number of results per page',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    example: { genre: 'hip-hop', artist: 'Drake' },
    description: 'Filters',
    required: false,
  })
  @IsOptional()
  filters?: Record<string, any>;
}
