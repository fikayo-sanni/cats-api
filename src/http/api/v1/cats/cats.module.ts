import { Module } from '@nestjs/common';
import { CatsController } from './controllers/cats.controller';
import { CatsService } from './services/cats.service';
import { UsersService } from '../users/services/users.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService, UsersService],
})
export class CatsModule {}
