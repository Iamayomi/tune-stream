import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAlbumDTO {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly coverImage: string;

  @IsString()
  @IsNotEmpty()
  readonly genre: string;

  // @IsArray()
  @IsNotEmpty()
  @IsNumber()
  readonly artist: number;

  @IsString()
  @IsDateString()
  readonly releaseDate: Date;
}
