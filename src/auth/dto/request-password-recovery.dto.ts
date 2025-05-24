import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordRecoveryDto {
  @ApiProperty({
    description: 'Email address for password recovery request',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsNotEmpty({ message: 'Email should not be empty.' })
  email: string;
}
