import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService implements OnModuleInit {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      this.logger.error('Supabase URL or Anon Key is missing. Check your .env file.');
      throw new Error('Supabase URL or Anon Key is missing.');
    }

    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    this.logger.log('Supabase client initialized.');
  }

import { CreateUserDto } from './auth/dto/create-user.dto'; // Corrected path
import { HttpException, HttpStatus } from '@nestjs/common';

// ... (rest of the existing code for AuthService up to the register method)

  async register(createUserDto: CreateUserDto) {
    this.logger.log(`Attempting to register user: ${createUserDto.email}`);
    const { email, password } = createUserDto;

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      this.logger.error(`Error during Supabase sign up for ${email}:`, error.message);
      // You might want to map Supabase errors to specific HTTP status codes
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Supabase signUp returns data containing user and session if successful
    // For email confirmation, user might not be active immediately
    this.logger.log(`User registration initiated for ${email}: ${JSON.stringify(data)}`);
    
    // Depending on your email confirmation settings, data.user might exist but session might be null.
    // The task asks to register, not necessarily to return a logged-in session immediately.
    // If email confirmation is enabled (default on Supabase), the user object is returned but they need to confirm.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
        // This can indicate that the user already exists but is unconfirmed. 
        // Supabase might return a user object even if "Email already exists"
        // Or if "User already registered" for a confirmed user.
        // It's good to check for specific error messages or codes if Supabase provides them.
        // For now, we'll assume a generic error if data.user seems invalid after no error.
         this.logger.warn(`User ${email} might already exist or registration requires confirmation.`);
         // Supabase often returns a 422 or similar for existing users, which should be caught by the error block.
         // If it doesn't, this is a fallback.
    }
    
    // The task is to register, so returning the user data (or a subset) is appropriate.
    // If session is null and email confirmation is on, client needs to know user should confirm.
    return {
      message: 'Registration successful. Please check your email to confirm your account.',
      user: data.user, // Be mindful of what user data you expose
      session: data.session // This will likely be null if email confirmation is pending
    };
  }

  async login(loginUserDto: LoginUserDto) {
    this.logger.log(`Attempting to login user: ${loginUserDto.email}`);
    const { email, password } = loginUserDto;

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      this.logger.error(`Error during Supabase sign in for ${email}:`, error.message);
      throw new HttpException(error.message, error.status || HttpStatus.UNAUTHORIZED);
    }

    this.logger.log(`User ${email} logged in successfully.`);
    return {
      message: 'Login successful.',
      user: data.user,
      session: data.session,
    };
  }

  async requestPasswordRecovery(requestPasswordRecoveryDto: RequestPasswordRecoveryDto) {
    this.logger.log(`Attempting to send password reset for email: ${requestPasswordRecoveryDto.email}`);
    const { email } = requestPasswordRecoveryDto;

    // Note: Ensure your Supabase project has an email template for password resets.
    // The redirectTo URL should point to your frontend page that handles the password update.
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3001/update-password', // Placeholder URL
    });

    if (error) {
      this.logger.error(`Error sending password reset email for ${email}:`, error.message);
      // Supabase might return errors for non-existent users, rate limits, etc.
      // It's often better not to reveal if an email exists in the system for security reasons.
      // So, a generic success message might be returned even if the email doesn't exist.
      // However, for development, logging the actual error is useful.
      // For production, consider the security implications of error messages.
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.logger.log(`Password reset email sent successfully to ${email}.`);
    return {
      message: 'If an account with this email exists, a password reset link has been sent.',
      // Supabase resetPasswordForEmail returns { data: {}, error: null } on success.
      // No sensitive user data is returned here.
      data, 
    };
  }
}
