import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LikeSongDTO {
  @ApiProperty({
    example: 'try me',
    description: 'Provide the user id',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly userId?: number;

  @ApiProperty({
    example: '1',
    description: 'Provide the song id ',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly songId?: number;
}
