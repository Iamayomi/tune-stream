import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { CreateUserDTO } from 'src/users/auth/dto/create-user-dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDTO, ['terms_of_service', 'email'] as const),
) {
  @ApiPropertyOptional({
    example: 'monica joe',
    description: 'Provide the full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({
    example: 'https://avater.png.com',
    description: 'provide the profile image',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    example: 'Testing123#@',
    description: 'Provide the password of the user',
  })
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Cover image (jpg/png)',
  })
  image?: any;
}
