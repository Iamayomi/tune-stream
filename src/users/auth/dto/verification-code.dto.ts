import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerificationCodeDTO {
  @ApiProperty({
    example: 'xxxx67',
    description: 'Provide the verication code sent to your email',
  })
  @IsString()
  @IsNotEmpty()
  verificationCode: string;
}
