import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from '../entities/cats.entity';
import { Repository } from 'typeorm';
import { CreateCatDto } from '../dto/cat.create.dto';
import { IPaginationOptions, IPaginationResult } from 'src/common/interfaces/pagination.interface';
import { ResponseMessages } from 'src/common/exceptions/constants/messages.constants';
import { NotAuthorizedAppException, NotFoundAppException } from 'src/common/exceptions';
import { UpdateCatDto } from '../dto/cat.update.dto';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class CatsService {

  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,
    private readonly userService: UsersService,
  ) { }

  async create(createCatDto: CreateCatDto, user_id: number): Promise<Cat> {

    const user = await this.userService.findOne(user_id);

    if (!user) { // check if user exists
      throw new NotAuthorizedAppException(ResponseMessages.UNAUTHORIZED);
    }

    const cat = this.catRepository.create({...createCatDto, user}); // map user to cat entity
    return this.catRepository.save(cat); // save cat
  }

  async findAll(params: IPaginationOptions): Promise<IPaginationResult<Cat>> {
    const items = await this.catRepository.find(params); 

    const count = await this.catRepository.count()

    return { items, count };
  }

  async findOne(id: number): Promise<Cat> {
    return this.catRepository.findOne({ where: { id } })
  }

  async findByParams(params: Partial<CreateCatDto>): Promise<Cat> {
    return this.catRepository.findOne({ where: params });
  }

  async update(id: number, updateCatDto: UpdateCatDto): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundAppException(ResponseMessages.NOT_FOUND);
    }

    await this.catRepository.update(id, updateCatDto);
  }

  async remove(id: number): Promise<void> {
    const cat = await this.findOne(id);
    if (!cat) {
      throw new NotFoundAppException(ResponseMessages.NOT_FOUND);
    }
    await this.catRepository.remove(cat);
  }
}
