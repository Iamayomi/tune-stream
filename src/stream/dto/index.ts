import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class StreamSongDto {
  @ApiProperty({
    example: 7,
    description: 'Provide the song id',
  })
  @IsInt()
  songId: number;

  @ApiProperty({
    example: 7,
    description: 'Provide the user id',
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    example: 7,
    description: 'Provide the song duration played',
  })
  @IsInt()
  @Min(0)
  durationPlayed: number;
}
