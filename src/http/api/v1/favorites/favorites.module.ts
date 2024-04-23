import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorites.entity';
import { FavoriteController } from './controllers/favorites.controllers';
import { FavoritesService } from './services/favorites.service';
import { UsersService } from '../users/services/users.service';
import { CatsService } from '../cats/services/cats.service';
import { Cat } from '../cats/entities/cats.entity';
import { User } from '../users/entities/users.entity';
import { AppLogger } from 'src/common/utils/logger.util';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, User, Cat])],
  controllers: [FavoriteController],
  providers: [FavoritesService, UsersService, CatsService, AppLogger],
})
export class FavoritesModule {}
