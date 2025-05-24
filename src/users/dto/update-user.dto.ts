import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // ApiPropertyOptional for optional fields

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User\'s new email address (optional)',
    example: 'updated.user@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email?: string;

  @ApiPropertyOptional({
    description: 'User\'s new full name (optional)',
    example: 'Jane Doe',
  })
  @IsOptional()
  @IsString({ message: 'Full name must be a string.' })
  full_name?: string;

  @ApiPropertyOptional({
    description: 'Set user active status (optional). false = ban, true = unban.',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean value.' })
  is_active?: boolean;
}
