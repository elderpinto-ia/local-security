import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config'; // For mocking, if AuthService is not fully mocked

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        // Provide a mock for AuthService
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            requestPasswordRecovery: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /auth/register', () => {
    it('should call authService.register with the correct DTO', async () => {
      const createUserDto = { email: 'test@example.com', password: 'password123' };
      const expectedResult = { message: 'User registered', user: { id: '1', ...createUserDto } }; // Example result
      
      // Mock the service method
      (service.register as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.register(createUserDto);

      expect(service.register).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('POST /auth/login', () => {
    it('should call authService.login with the correct DTO', async () => {
      const loginUserDto = { email: 'test@example.com', password: 'password123' };
      const expectedResult = { message: 'Login successful', user: { id: '1', email: 'test@example.com' }, session: {} };
      
      (service.login as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.login(loginUserDto);

      expect(service.login).toHaveBeenCalledWith(loginUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('POST /auth/request-password-recovery', () => {
    it('should call authService.requestPasswordRecovery with the correct DTO', async () => {
      const requestDto = { email: 'test@example.com' };
      const expectedResult = { message: 'Password recovery email sent' };
      
      (service.requestPasswordRecovery as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.requestPasswordRecovery(requestDto);

      expect(service.requestPasswordRecovery).toHaveBeenCalledWith(requestDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
