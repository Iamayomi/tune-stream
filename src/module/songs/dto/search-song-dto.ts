import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class SearchTrackDto {
  @IsNotEmpty()
  @IsString()
  query: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  artist?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
