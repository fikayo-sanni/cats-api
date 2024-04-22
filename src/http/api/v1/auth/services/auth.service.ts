import { Injectable } from "@nestjs/common";
import appConfiguration from 'src/common/config/envs/app.config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from "../../users/services/users.service";
import { LoginAuthDto } from "../dto/auth.login.dto";
import { CreateUserDto } from "../../users/dto/user.create.dto";
import { ConfigType } from "@nestjs/config";
import { AppLogger } from "src/common/utils/logger.util";
import { hashString } from "src/common/utils/hash.util";
import { BadRequestAppException, UnAuthorizedAppException } from "src/common/exceptions";
import { ResponseMessages } from "src/common/exceptions/constants/messages.constants";
import { IUser } from "../../users/interfaces/users.interface";
import { UserRole } from "src/common/types/user.types";

@Injectable()
export class AuthService {

    protected appConfig: ConfigType<typeof appConfiguration>;

    constructor(
        private readonly userService: UsersService,
        private readonly appLogger: AppLogger,
        private readonly jwtService: JwtService,
    ) {
        this.appConfig = appConfiguration();
    }

    async login(loginAuthDto: LoginAuthDto): Promise<IUser> {
        try {
            // hash user password
            Object.assign(loginAuthDto, { password: hashString(loginAuthDto.password) });

            const user = await this.userService.findByParams(loginAuthDto);

            if(!user) {
                throw new UnAuthorizedAppException(ResponseMessages.INVALID_LOGIN)
            }

            const tokens = await this.getTokens(user.id, user.roles);

            delete user.password;

            return { ...user, ...tokens };
        } catch (e) {
            this.appLogger.logError(e);
            throw e;
        }
    }

    async register(createUserDto: CreateUserDto): Promise<IUser> {
        try {

            const exists = await this.userService.findByParams({ email: createUserDto.email });
            if (exists) {
                // throw error if email is in use
                throw new BadRequestAppException(ResponseMessages.CREDENTIALS_IN_USE);
            }

            // hash user password
            Object.assign(createUserDto, { password: hashString(createUserDto.password) });
            const user = await this.userService.create(createUserDto);

            return user;
        } catch (e) {
            this.appLogger.logError(e);
            throw e;
        }
    }

    async getTokens(id: number, roles: Array<UserRole>) {
        // generate 7h access token and 7d refresh token
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: id,
                    roles
                },
                {
                    secret: this.appConfig.JWT_SECRET,
                    expiresIn: '7h',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: id,
                    roles,
                },
                {
                    secret: this.appConfig.JWT_REFRESH_SECRET,
                    expiresIn: '7d',
                },
            ),
        ]);

        // update user record to contain refresh token
        await this.userService.update(id, { refresh_token });
        return {
            access_token,
            refresh_token,
        };
    }

    async sessionUser(id: number) {
        // nullify user's refresh token
        return this.userService.findOne(id);
    }

    async logout(id: number) {
        // nullify user's refresh token
        return this.userService.update(id, { refresh_token: null });
    }

    // TODO: create forgotPassword

    // TODO: implement changePassword
}