import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dto/user.create.dto";
import { User } from "../entities/users.entity";
import { UpdateUserDto } from "../dto/user.update.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IPaginationOptions, IPaginationResult } from "src/common/interfaces/pagination.interface";
import { ResponseMessages } from "src/common/exceptions/constants/messages.constants";
import { NotFoundAppException } from "src/common/exceptions";
import { UserRole } from "src/common/types/user.types";
import { AppLogger } from "src/common/utils/logger.util";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly appLogger: AppLogger,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }

    async findAll(params: IPaginationOptions): Promise<IPaginationResult<User>> {
        const items = await this.userRepository.find(params)

        const count = await this.userRepository.count();

        return { items, count }
    }

    async findOne(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id } })
    }

    async findByParams(params: Omit<Partial<UpdateUserDto>, 'roles'>): Promise<User> {
        return this.userRepository.findOne({where: params});
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {

        this.appLogger.logInfo(updateUserDto);

        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundAppException(ResponseMessages.NOT_FOUND);
        }

        this.appLogger.logInfo(updateUserDto);

        await this.userRepository.update(id, updateUserDto);
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundAppException(ResponseMessages.NOT_FOUND);
        }
        await this.userRepository.remove(user);
    }

    async makeAdmin(id: number): Promise<void> {
        const user = await this.findOne(id)

        if (!user) {
            throw new NotFoundAppException(ResponseMessages.NOT_FOUND);
        }

        const is_admin = user.roles.find((item: UserRole)=> item === UserRole.ADMIN)
        if (!is_admin) {
            user.roles.push(UserRole.ADMIN);
            await this.update(id, {roles: user.roles})
        }
    }
}