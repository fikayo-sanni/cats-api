import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from '../entities/favorites.entity';
import { Repository } from 'typeorm';
import { ResponseMessages } from 'src/common/exceptions/constants/messages.constants';
import { NotFoundAppException } from 'src/common/exceptions';
import { FavoriteDto } from '../dtos/favorites.dto';
import { UsersService } from '../../users/services/users.service';
import { CatsService } from '../../cats/services/cats.service';

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
            throw new NotFoundAppException(ResponseMessages.RESOURCE_EXISTS);
        }

        const user = await this.userService.findOne(createFavoriteDto.user_id);

        const cat = await this.catService.findOne(createFavoriteDto.cat_id);

        const new_favorite = this.favoriteRepository.create({user, cat});
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
}
