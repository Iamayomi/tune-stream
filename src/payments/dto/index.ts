import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class IntiatePaymentDto {
  @ApiProperty({ example: 2, required: false })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'NGN', required: false })
  @IsNotEmpty()
  @IsString()
  currency: string;
}
