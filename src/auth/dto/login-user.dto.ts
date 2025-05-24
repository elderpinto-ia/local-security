import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'User\'s email address for login',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsNotEmpty({ message: 'Email should not be empty.' })
  email: string;

  @ApiProperty({
    description: 'User\'s password for login',
    example: 'Str0ngP@ss!',
  })
  @IsNotEmpty({ message: 'Password should not be empty.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;
}
