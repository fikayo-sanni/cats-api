import { Module } from '@nestjs/common';
import { CatsController } from './controllers/cats.controller';
import { CatsService } from './services/cats.service';
import { UsersService } from '../users/services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './entities/cats.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cat, User]), UsersModule], // Import any modules that provide dependencies for CatsService
  controllers: [CatsController],
  providers: [CatsService, UsersService],
})
export class CatsModule {}
