import { UserRole } from "src/common/types/user.types";
import { User } from "../../users/entities/users.entity";
import { LoginAuthDto } from "../dto/auth.login.dto";
import { MockTimestamps } from "src/common/mocks/common.mocks";

export const RegisterBody = {
    first_name: 'Oluwafikayo',
    last_name: 'Sanni',
    email: 'fikayo.sanni@gmail.com',
    username: 'oluwafikayomi',
    password: '@Test1234'
}

export const RegisterResult = {
    ...RegisterBody,
    password: 'f926b91963b91e3e46d68f694ac5f4d5',
    refresh_token: null,
    id: 3,
    ...MockTimestamps,
    roles: [
        UserRole.USER
    ]
} as unknown as User;

export const LoginRequest = {
    email: 'fikayo.sanni@gmail.com',
    password: '@Test1234'
} as unknown as LoginAuthDto;

export const AccessTokens = {
    refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNzEzNzc5NjEwLCJleHAiOjE3MTQzODQ0MTB9.VoKbqGhOTG_jv1EqjIszgWeIb0WepCqVxk-73P3BNkM',
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNzEzNzc5NjEwLCJleHAiOjE3MTM4MDQ4MTB9.zhBY-D-GUsewRjrkqYZD4R3tiGx6H_aw160hjXEcHk8'
}

export const LoginResult = {
    ...RegisterResult,
    ...AccessTokens,
}

export const RefreshTokensRequest = {
    refresh_token : AccessTokens.access_token,
}

export const ChangePasswordRequest = {
    password: 'password'
}