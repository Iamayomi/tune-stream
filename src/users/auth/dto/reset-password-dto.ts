import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDTO {
  @ApiProperty({
    example: 'Testing123#@',
    description: 'Provide the password of the user',
  })
  @IsString()
  @IsNotEmpty()
  new_password: string;

  @ApiProperty({
    example: 'Testing123#@',
    description: 'Provide the password of the user',
  })
  @IsString()
  @IsStrongPassword({ minLength: 6 }, { message: 'Password not strong enough' })
  confirm_newpassword: string;
}
