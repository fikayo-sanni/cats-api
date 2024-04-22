import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../users/services/users.service';
import { AppLogger } from 'src/common/utils/logger.util';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { Cat } from '../cats/entities/cats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cat, User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, AppLogger, JwtService],
})
export class AuthModule {}
