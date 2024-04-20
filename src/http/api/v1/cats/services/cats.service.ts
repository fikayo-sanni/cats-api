import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from '../entities/cats.entity';
import { Repository } from 'typeorm';
import { CreateCatDto } from '../dto/cat.create.dto';
import { IPaginationOptions, IPaginationResult } from 'src/common/interfaces/pagination.interface';
import { ResponseMessages } from 'src/common/exceptions/constants/messages.constants';
import { NotFoundAppException } from 'src/common/exceptions';
import { UpdateCatDto } from '../dto/cat.update.dto';

@Injectable()
export class CatsService {

  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>
  ) { }

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const cat = this.catRepository.create(createCatDto);
    return this.catRepository.save(cat);
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
    return this.catRepository.findOne({where: params});
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
