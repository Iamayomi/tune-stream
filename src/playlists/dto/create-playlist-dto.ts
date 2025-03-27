import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreatePlayListDto {
  @ApiProperty({ example: 'jamz', description: 'playlist name' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: '1', description: 'add song to playlist' })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly songs: any;

  @ApiProperty({ example: 'true', description: 'is public' })
  @IsBoolean()
  readonly isPublic: boolean;
}

export class AddSongToPlaylist {
  @IsNumber()
  @IsNotEmpty()
  playlistId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly songId: number;
}
