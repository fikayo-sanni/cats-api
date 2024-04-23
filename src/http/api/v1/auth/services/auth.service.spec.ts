import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from '../dto/auth.login.dto';
import { CreateUserDto } from '../../users/dto/user.create.dto';
import { AppLogger } from 'src/common/utils/logger.util';
import { UnAuthorizedAppException, BadRequestAppException, NotAuthorizedAppException } from 'src/common/exceptions';
import { UserRole } from 'src/common/types/user.types';
import { AccessTokens, LoginRequest, RegisterBody, RegisterResult } from '../mocks/auth.mocks';
import { MockUser } from 'src/common/mocks/common.mocks';
import { User } from '../../users/entities/users.entity';

describe('AuthService', () => {
    let service: AuthService;
    let userService: UsersService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        findByParams: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn(),
                    },
                },
                {
                    provide: AppLogger,
                    useValue: {
                        logError: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('login', () => {
        it('should login a user and return tokens', async () => {
            const loginAuthDto: LoginAuthDto = LoginRequest;
            const user: User = MockUser as unknown as User;
            const tokens = AccessTokens;

            jest.spyOn(userService, 'findByParams').mockResolvedValueOnce(user);
            jest.spyOn(service, 'getTokens').mockResolvedValueOnce(tokens);

            const result = await service.login(loginAuthDto);

            expect(userService.findByParams).toHaveBeenCalledWith(loginAuthDto);
            expect(service.getTokens).toHaveBeenCalledWith(user.id, user.roles);
            expect(result).toEqual({ ...user, ...tokens });
        });

        it('should throw UnAuthorizedAppException if user does not exist', async () => {
            const loginAuthDto: LoginAuthDto = LoginRequest;

            jest.spyOn(userService, 'findByParams').mockResolvedValueOnce(null);

            await expect(service.login(loginAuthDto)).rejects.toThrow(UnAuthorizedAppException);
        });
    });

    describe('register', () => {
        it('should register a new user', async () => {
            const createUserDto: CreateUserDto = RegisterBody;
            const user: User = RegisterResult;

            jest.spyOn(userService, 'findByParams').mockResolvedValueOnce(null);
            jest.spyOn(userService, 'create').mockResolvedValueOnce(user);

            const result = await service.register(createUserDto);

            expect(userService.findByParams).toHaveBeenCalledWith({ email: createUserDto.email });
            expect(userService.create).toHaveBeenCalledWith(createUserDto);
            expect(result).toEqual(user);
        });

        it('should throw BadRequestAppException if email is in use', async () => {
            const createUserDto: CreateUserDto = RegisterBody;
            const existingUser: User = MockUser as unknown as User;

            jest.spyOn(userService, 'findByParams').mockResolvedValueOnce(existingUser);

            await expect(service.register(createUserDto)).rejects.toThrow(BadRequestAppException);
        });
    });

    describe('getTokens', () => {
        it('should return tokens for a user', async () => {
            const id = 4;
            const roles: UserRole[] = [UserRole.ADMIN, UserRole.USER];
            const tokens = AccessTokens;

            jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce(tokens.access_token);
            jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce(tokens.refresh_token);
            jest.spyOn(userService, 'update').mockResolvedValueOnce();

            const result = await service.getTokens(id, roles);

            expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
            expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: id, roles }, expect.any(Object));
            expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: id, roles }, expect.any(Object));
            expect(userService.update).toHaveBeenCalledWith(id, { refresh_token: tokens.refresh_token });
            expect(result).toEqual(tokens);
        });
    });

    describe('sessionUser', () => {
        it('should return user without modifying refresh token', async () => {
            const id = 4;
            const user: User = MockUser as unknown as User;

            jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);

            const result = await service.sessionUser(id);

            expect(userService.findOne).toHaveBeenCalledWith(id);
            expect(result).toEqual(user);
        });
    });

    describe('refreshTokens', () => {
        it('should refresh tokens for a user', async () => {
            const refresh_token: string = AccessTokens.refresh_token;
            const user: User = MockUser as unknown as User;
            const tokens = AccessTokens;

            jest.spyOn(userService, 'findByParams').mockResolvedValueOnce(user);
            jest.spyOn(service, 'getTokens').mockResolvedValueOnce(tokens);

            const result = await service.refreshTokens(refresh_token);

            expect(userService.findByParams).toHaveBeenCalledWith({ refresh_token });
            expect(service.getTokens).toHaveBeenCalledWith(user.id, user.roles);
            expect(result).toEqual(tokens);
        });

        it('should throw NotAuthorizedAppException if user does not exist', async () => {
            const refresh_token: string = AccessTokens.refresh_token;

            jest.spyOn(userService, 'findByParams').mockResolvedValueOnce(null);

            await expect(service.refreshTokens(refresh_token)).rejects.toThrow(NotAuthorizedAppException);
        });
    });

    describe('changePassword', () => {
        it('should change user\'s password', async () => {
            const id = 4;
            const password = "passo";
            const user: User = MockUser as unknown as User;

            jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);
            jest.spyOn(userService, 'update').mockResolvedValueOnce();

            await service.changePassword(id, password);

            expect(userService.findOne).toHaveBeenCalledWith(id);
            expect(userService.update).toHaveBeenCalledWith(id, { password: expect.any(String) });
        });

        it('should throw NotAuthorizedAppException if user does not exist', async () => {
            const id = 4;
            const password = "passo";

            jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

            await expect(service.changePassword(id, password)).rejects.toThrow(NotAuthorizedAppException);
        });
    });

    describe('logout', () => {
        it('should nullify user\'s refresh token', async () => {
            const id = 4;

            jest.spyOn(userService, 'update').mockResolvedValueOnce();

            await service.logout(id);

            expect(userService.update).toHaveBeenCalledWith(id, { refresh_token: null });
        });
    });


});

