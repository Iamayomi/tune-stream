import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateUserDTO {
  @ApiProperty({
    example: 'monica',
    description: 'Provide the first name of the user',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Adam',
    description: 'provide the lastName of the user',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'monica@gmail.com',
    description: 'Provide the email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'free', description: 'Subscription type' })
  @IsString()
  subscription: 'free' | 'premium';

  @ApiProperty({
    example: 'test123#@',
    description: 'Provide the password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'true',
    description: 'Provide the terms_of_service',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Column({ default: 'false' })
  terms_of_service: boolean;
}
