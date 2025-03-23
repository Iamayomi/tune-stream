import { Optional } from '@nestjs/common';
import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSongDTO {

  @IsString()
  @IsOptional()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly coverImage: string;
  
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly artists;

  @IsOptional()
  @IsDateString()
  readonly releaseDate: Date;

  @IsOptional()
  @IsMilitaryTime()
  readonly duration: Date;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
