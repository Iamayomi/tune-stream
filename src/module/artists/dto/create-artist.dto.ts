import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class createArtistDTO {
  @IsString()
  @IsNotEmpty()
  readonly stageName: string;
}
