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

    const cat = this.catRepository.create({ ...createCatDto, user }); // map user to cat entity
    return this.catRepository.save(cat); // save cat
  }

  async findAll(params: IPaginationOptions): Promise<IPaginationResult<Cat>> {
    const items = await this.catRepository
      .createQueryBuilder('cat')
      .leftJoinAndSelect('cat.favorite', 'favorite') // Join the Favorite entity
      .select([
        'cat.id', // Assuming there's an 'id' field in Cat entity
        'cat.name',
        'cat.birthday',
        'cat.breed',
        'COUNT(favorite.id) AS favorite_num', // Count the number of favorites
      ])
      .groupBy('cat.id') // Group by cat id to get the count for each cat
      .skip(params.skip) // Apply the skip parameter
      .take(params.take) // Apply the take parameter
      .getRawMany();

    const count = await this.catRepository.count()

    return { items, count };
  }

  async findOne(id: number): Promise<Cat> {
    const cat = await this.catRepository
      .createQueryBuilder('cat')
      .leftJoinAndSelect('cat.user', 'user') // Join the User entity
      .leftJoin('cat.favorite', 'favorite') // Left join the Favorite entity
      .addSelect('COUNT(favorite.id) AS favoriteCount') // Select the count of favorites
      .where('cat.id = :id', { id }) // Filter by cat id
      .groupBy('cat.id, user.id') // Group by cat id and user id
      .getOne();

    if (!cat) {
      throw new NotFoundAppException(ResponseMessages.NOT_FOUND);
    }

    return cat;
  }

  async findByParams(params: Partial<CreateCatDto>): Promise<Cat> {
    return this.catRepository.findOne({ where: params });
  }

  async update(id: number, updateCatDto: UpdateCatDto): Promise<void> {
    await this.findOne(id);
    await this.catRepository.update(id, updateCatDto);
  }

  async remove(id: number): Promise<void> {
    const cat = await this.findOne(id);

    await this.catRepository.remove(cat);
  }
}
