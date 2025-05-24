import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js'; // For typing the mock
import { HttpException, HttpStatus } from '@nestjs/common';

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    resetPasswordForEmail: jest.fn(),
  },
};

describe('AuthService', () => {
  let service: AuthService;
  let configService: ConfigService;

  beforeEach(async () => {
    // Reset mocks for each test
    mockSupabaseClient.auth.signUp.mockReset();
    mockSupabaseClient.auth.signInWithPassword.mockReset();
    mockSupabaseClient.auth.resetPasswordForEmail.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'SUPABASE_URL') return 'http://localhost:54321';
              if (key === 'SUPABASE_ANON_KEY') return 'test_anon_key';
              return null;
            }),
          },
        },
        // Override the Supabase client creation in onModuleInit
        // This is a bit tricky as SupabaseClient is created in onModuleInit.
        // A common approach is to mock the createClient function or inject the client.
        // For simplicity here, we'll rely on the fact that our tests will call methods
        // that use `this.supabase` which we can set after service instantiation.
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);

    // Manually inject the mock Supabase client into the service instance
    // This bypasses the onModuleInit creation for testing purposes.
    (service as any).supabase = mockSupabaseClient;
    (service as any).logger = { log: jest.fn(), error: jest.fn(), warn: jest.fn() }; // Mock logger
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const createUserDto = { email: 'test@example.com', password: 'password123' };
    
    it('should successfully register a user', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      mockSupabaseClient.auth.signUp.mockResolvedValue({ data: { user: mockUser, session: {} }, error: null });

      const result = await service.register(createUserDto);
      expect(result.user).toEqual(mockUser);
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: createUserDto.password,
      });
    });

    it('should throw HttpException on Supabase signUp error', async () => {
      const mockError = { message: 'User already registered', status: 400 };
      mockSupabaseClient.auth.signUp.mockResolvedValue({ data: {}, error: mockError });

      await expect(service.register(createUserDto)).rejects.toThrow(
        new HttpException(mockError.message, mockError.status),
      );
    });
  });

  describe('login', () => {
    const loginUserDto = { email: 'test@example.com', password: 'password123' };

    it('should successfully log in a user', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockSession = { access_token: 'fake_token', user: mockUser };
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({ data: { user: mockUser, session: mockSession }, error: null });

      const result = await service.login(loginUserDto);
      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: loginUserDto.email,
        password: loginUserDto.password,
      });
    });

    it('should throw HttpException on Supabase signIn error', async () => {
      const mockError = { message: 'Invalid login credentials', status: 401 };
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({ data: {}, error: mockError });

      await expect(service.login(loginUserDto)).rejects.toThrow(
        new HttpException(mockError.message, mockError.status),
      );
    });
  });

  describe('requestPasswordRecovery', () => {
    const requestPasswordRecoveryDto = { email: 'test@example.com' };

    it('should successfully request password recovery', async () => {
      mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });

      const result = await service.requestPasswordRecovery(requestPasswordRecoveryDto);
      expect(result.message).toContain('password reset link has been sent');
      expect(mockSupabaseClient.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        requestPasswordRecoveryDto.email,
        { redirectTo: expect.any(String) },
      );
    });

    it('should throw HttpException on Supabase resetPasswordForEmail error', async () => {
      const mockError = { message: 'Error sending recovery email', status: 500 };
      mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: mockError });

      await expect(service.requestPasswordRecovery(requestPasswordRecoveryDto)).rejects.toThrow(
        new HttpException(mockError.message, mockError.status),
      );
    });
  });
});
