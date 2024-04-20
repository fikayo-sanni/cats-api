import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dto/user.create.dto";
import { User } from "../entities/users.entity";
import { UpdateUserDto } from "../dto/user.update.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

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

    async findAll(params: PaginationOptions): Promise<User> {
        return this.userRepository.find()
    }

    async findOne(id: number) {
        return User.findOne({ where: { id } })
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        return User.update(id, updateUserDto);
    }

    async remove(id: number) {
        return User.remove({ where: { id } });
    }
}