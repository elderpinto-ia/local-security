import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User\'s email address (must be unique)',
    example: 'new.admin.user@example.com',
  })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsNotEmpty({ message: 'Email should not be empty.' })
  email: string;

  @ApiProperty({
    description: 'User\'s password (at least 6 characters)',
    example: 'SecureP@ss123',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Password should not be empty.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;

  @ApiProperty({
    description: 'User\'s full name (optional)',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Full name must be a string.' })
  @IsNotEmpty({ message: 'Full name should not be empty if provided.' })
  full_name?: string;
}
