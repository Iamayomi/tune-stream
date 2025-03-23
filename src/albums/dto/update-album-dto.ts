import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateAlbumDTO {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly coverImage: string;

  @IsOptional()
  @IsString()
  readonly genre: string;

 

  @IsOptional()
  @IsArray()
  // @IsNumber({}, { each: true })
  readonly tracks: any[];

  @IsOptional()
  @IsString()
  @IsDateString()
  readonly releaseDate: Date;
}
