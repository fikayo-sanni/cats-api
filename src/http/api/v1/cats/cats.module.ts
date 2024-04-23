import { Module } from '@nestjs/common';
import { CatsController } from './controllers/cats.controller';
import { CatsService } from './services/cats.service';
import { UsersService } from '../users/services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './entities/cats.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/users.entity';
import { AppLogger } from 'src/common/utils/logger.util';
import { Favorite } from '../favorites/entities/favorites.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cat, User, Favorite]), UsersModule],
  controllers: [CatsController],
  providers: [CatsService, UsersService, AppLogger],
})
export class CatsModule {}
