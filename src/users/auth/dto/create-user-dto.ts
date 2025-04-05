import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Column } from 'typeorm';
import {
  CustomValidator,
  IsPhoneNumberConstraint,
  IsTrueConstraint,
} from '../../../library/validator';

export class CreateUserDTO {
  @ApiProperty({
    example: 'monica joe',
    description: 'Provide the full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({
    example: '+234806778****',
    description: 'provide the phone number',
  })
  @IsString()
  @CustomValidator(IsPhoneNumberConstraint, {
    message: 'Invalid phone number format',
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'monica@gmail.com',
    description: 'Provide the email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'test123#@',
    description: 'Provide the password of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  @IsStrongPassword({ minLength: 6 }, { message: 'Password not strong enough' })
  password: string;

  @ApiProperty({
    example: 'true',
    description: 'Provide the terms_of_service',
  })
  @IsBoolean()
  @IsNotEmpty()
  @CustomValidator(IsTrueConstraint, {
    message: 'You must accept the terms of service',
  })
  @Column({ type: 'boolean', default: false })
  terms_of_service: boolean;
}
