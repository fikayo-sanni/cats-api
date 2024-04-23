import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from '../entities/favorites.entity';
import { Repository } from 'typeorm';
import { ResponseMessages } from 'src/common/exceptions/constants/messages.constants';
import { BadRequestAppException, NotFoundAppException } from 'src/common/exceptions';
import { FavoriteDto } from '../dtos/favorites.dto';
import { UsersService } from '../../users/services/users.service';
import { CatsService } from '../../cats/services/cats.service';
import { IPaginationOptions, IPaginationResult } from 'src/common/interfaces/pagination.interface';

@Injectable()
export class FavoritesService {

    constructor(
        @InjectRepository(Favorite)
        private readonly favoriteRepository: Repository<Favorite>,
        private readonly userService: UsersService,
        private readonly catService: CatsService,
    ) { }

    async create(createFavoriteDto: FavoriteDto): Promise<Favorite> {
        const favorite = await this.findOne(createFavoriteDto);

        if (favorite) {
            throw new BadRequestAppException(ResponseMessages.RESOURCE_EXISTS);
        }

        const user = await this.userService.findOne(createFavoriteDto.user_id);

        const cat = await this.catService.findOne(createFavoriteDto.cat_id);

        const new_favorite = this.favoriteRepository.create({ user, cat });
        return this.favoriteRepository.save(new_favorite);
    }

    async findOne(params: FavoriteDto): Promise<Favorite> {
        return await this.favoriteRepository.findOne({ where: params });
    }

    async remove(params: FavoriteDto): Promise<void> {
        const favorite = await this.findOne(params);
        if (!favorite) {
            throw new NotFoundAppException(ResponseMessages.NOT_FOUND);
        }
        await this.favoriteRepository.remove(favorite);
    }

    async removeMany(params: FavoriteDto): Promise<void> {
        await this.favoriteRepository.delete(params);
    }

    async findAllByParams(params: Partial<FavoriteDto>, pagination: IPaginationOptions): Promise<IPaginationResult<Favorite>> {

        if (params.cat_id) {
            await this.catService.findOne(params.cat_id);
        }

        if (params.user_id) {
            await this.userService.findOne(params.user_id);
        }

        const queryBuilder = this.favoriteRepository.createQueryBuilder('favorite')
            .leftJoinAndSelect('favorite.cat', 'cat')
            .leftJoinAndSelect('favorite.user', 'user');

        if (params.user_id) {
            queryBuilder.andWhere('user.id = :userId', { userId: params.user_id });
        }

        if (params.cat_id) {
            queryBuilder.andWhere('cat.id = :catId', { catId: params.cat_id });
        }

        queryBuilder.take(pagination.take);

        queryBuilder.skip(pagination.skip);


        const items = await queryBuilder.getMany();


        const count = await this.favoriteRepository.count({ where: params })

        return { items, count };


    }
}
