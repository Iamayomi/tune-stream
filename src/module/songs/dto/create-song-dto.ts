import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSongDTO {
  @ApiProperty({
    example: 'try me',
    description: 'Provide the song title',
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    example: '1',
    description: 'Provide the album id ',
  })
  @IsNumber()
  @IsOptional()
  album?: number;

  @ApiProperty({
    example: [1],
    description: 'Provide the artist id ',
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly artists: any;

  @ApiProperty({
    example: 'http://pic.png',
    description: 'Provide the cover image',
  })
  @IsString()
  @IsNotEmpty()
  readonly coverImage: string;

  @ApiProperty({
    example: '2022-08-29',
    description: 'Provide the releaseDate',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly releaseDate: Date;

  @ApiProperty({
    example: '02:34',
    description: 'Provide the song duration',
  })
  @IsNotEmpty()
  @IsMilitaryTime()
  readonly duration: Date;

  @ApiProperty({
    example: 5,
    description: 'Provide the song popularity',
  })
  @IsNotEmpty()
  @IsNumber()
  popularity: number;

  @ApiProperty({
    example:
      "by, you're my adrenaline. Brought out this other side of me You don't",
    description: 'Provide the song lyrics',
  })
  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
