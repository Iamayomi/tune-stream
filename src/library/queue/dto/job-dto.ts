import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class JobDTO {
  @IsInt()
  @IsNotEmpty()
  songId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsOptional()
  albumId?: number;

  @IsInt()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    example: '2022-08-29',
    description: 'Provide the releaseDate',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly streamedAt: Date;
}
