import { PartialType } from '@nestjs/swagger/dist/type-helpers';
import { IsNotEmpty, IsString } from 'class-validator';

export class createArtistDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly bio: string;
}

export class UpdateArtistDto extends PartialType(createArtistDTO) {}
