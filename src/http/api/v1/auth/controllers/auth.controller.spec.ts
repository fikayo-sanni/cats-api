import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../../users/dto/user.create.dto';
import { LoginAuthDto } from '../dto/auth.login.dto';
import { Response } from 'express';
import { IAuthRequest } from 'src/common/types/auth.types';
import { RefreshAuthDto } from '../dto/auth.refresh.dto';
import { ChangePasswordAuthDto } from '../dto/auth.change_password.dto';
import { UserRole } from 'src/common/types/user.types';
import { AccessTokens, ChangePasswordRequest, LoginRequest, LoginResult, RefreshTokensRequest, RegisterBody, RegisterResult } from '../mocks/auth.mocks';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<IAuthRequest>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            sessionUser: jest.fn(),
            refreshTokens: jest.fn(),
            changePassword: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    mockResponse = {
      send: jest.fn(),
    };
    mockRequest = {
      user: { sub: 1, roles: [UserRole.ADMIN, UserRole.USER] },
    };

    // Manually create a mock for getHttpResponse and assign it to the controller instance
    controller.getHttpResponse = jest.fn().mockReturnValue({
      setDataWithKey: jest.fn().mockReturnThis(),
      setAuthDataWithKey: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const createUserDto: CreateUserDto = RegisterBody;
    const expectedResult = RegisterResult;
    
    jest.spyOn(authService, 'register').mockResolvedValueOnce(RegisterResult);

    await controller.signup(createUserDto, mockResponse as Response);

    expect(authService.register).toHaveBeenCalledWith(createUserDto);
    expect(controller.getHttpResponse().setDataWithKey).toHaveBeenCalledWith(
      'data',
      expectedResult,
    );
  });

  it('should sign in a user', async () => {
    const loginAuthDto: LoginAuthDto = LoginRequest;
    const expectedResult = LoginResult;
    
    jest.spyOn(authService,'login').mockResolvedValueOnce(expectedResult);

    await controller.signin(loginAuthDto, mockResponse as Response);

    expect(authService.login).toHaveBeenCalledWith(loginAuthDto);
    expect(controller.getHttpResponse().setAuthDataWithKey).toHaveBeenCalledWith(
      'data',
      expectedResult,
    );
  });

  it('should retrieve session user', async () => {
    const expectedResult = RegisterResult;
    jest.spyOn(authService,'sessionUser').mockResolvedValueOnce(expectedResult);

    await controller.sessionUser(mockRequest as IAuthRequest, mockResponse as Response);

    expect(authService.sessionUser).toHaveBeenCalledWith(mockRequest.user.sub);
    expect(controller.getHttpResponse().setAuthDataWithKey).toHaveBeenCalledWith(
      'data',
      expectedResult,
    );
  });

  it('should refresh user tokens', async () => {
    const refreshAuthDto: RefreshAuthDto = RefreshTokensRequest;
    const expectedResult = AccessTokens;
    jest.spyOn(authService,'refreshTokens').mockResolvedValueOnce(expectedResult);

    await controller.refreshUserTokens(refreshAuthDto, mockResponse as Response);

    expect(authService.refreshTokens).toHaveBeenCalledWith(refreshAuthDto.refresh_token);
    expect(controller.getHttpResponse().setAuthDataWithKey).toHaveBeenCalledWith(
      'data',
      expectedResult,
    );
  });

  it('should change user password', async () => {
    const changePasswordAuthDto: ChangePasswordAuthDto = ChangePasswordRequest;
    const expectedResult = null;
    jest.spyOn(authService,'changePassword').mockResolvedValueOnce(expectedResult);

    await controller.changePassword(changePasswordAuthDto, mockRequest as IAuthRequest, mockResponse as Response);

    expect(authService.changePassword).toHaveBeenCalledWith(mockRequest.user.sub, changePasswordAuthDto.password);
    expect(controller.getHttpResponse().setAuthDataWithKey).toHaveBeenCalledWith(
      'data',
      expectedResult,
    );
  });

  it('should log out user', async () => {
    const expectedResult = null;
    jest.spyOn(authService,'logout').mockResolvedValueOnce(expectedResult);

    await controller.logout(mockRequest as IAuthRequest, mockResponse as Response);

    expect(authService.logout).toHaveBeenCalledWith(mockRequest.user.sub);
    expect(controller.getHttpResponse().setAuthDataWithKey).toHaveBeenCalledWith(
      'data',
      expectedResult,
    );
  });
});
