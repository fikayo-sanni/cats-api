import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dto/user.create.dto";
import { User } from "../entities/users.entity";
import { UpdateUserDto } from "../dto/user.update.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IPaginationOptions, IPaginationResult } from "src/common/interfaces/pagination.interface";
import { ResponseMessages } from "src/common/exceptions/constants/messages.constants";
import { NotFoundAppException } from "src/common/exceptions";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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

    async findByParams(params: Partial<UpdateUserDto>): Promise<User> {
        return this.userRepository.findOne({where: params});
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundAppException(ResponseMessages.NOT_FOUND);
        }

        await this.userRepository.update(id, updateUserDto);
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundAppException(ResponseMessages.NOT_FOUND);
        }
        await this.userRepository.remove(user);
    }
}