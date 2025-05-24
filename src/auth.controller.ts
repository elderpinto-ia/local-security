import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './auth/dto/create-user.dto';
import { LoginUserDto } from './auth/dto/login-user.dto'; // Ensure this import is present
import { RequestPasswordRecoveryDto } from './auth/dto/request-password-recovery.dto'; // Ensure this import is present

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User registered successfully. Please check your email to confirm your account.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request (e.g., validation error, email already exists).' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in an existing user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful. Returns user and session data.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials or user not confirmed.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request (e.g., validation error).' })
  async login(@Body() loginUserDto: LoginUserDto) { // DTO type was missing in the actual file content
    return this.authService.login(loginUserDto);
  }

  @Post('request-password-recovery')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'If an account with this email exists, a password reset link has been sent.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request (e.g., validation error).' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error during email sending.' })
  async requestPasswordRecovery(@Body() requestPasswordRecoveryDto: RequestPasswordRecoveryDto) { // DTO type was missing
    return this.authService.requestPasswordRecovery(requestPasswordRecoveryDto);
  }
}
