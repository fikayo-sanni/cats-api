import { Injectable } from "@nestjs/common";
import { UsersService } from "../../users/services/users.service";
import { LoginAuthDto } from "../interfaces/auth.login.dto";
import { User } from "../../users/entities/users.entity";
import { CreateUserDto } from "../../users/dto/user.create.dto";

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
    ) { }

    async login(loginAuthDto: LoginAuthDto): Promise<User> {
        const user = await this.userService.findByParams(loginAuthDto);

        return user;
    }

    async register(createUserDto: CreateUserDto): Promise<User> {
        const user = await this.userService.create(createUserDto);

        return user;
    }
}