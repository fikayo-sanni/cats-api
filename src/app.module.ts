import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsModule } from './http/api/v1/cats/cats.module';
import appConfiguration from 'src/common/config/envs/app.config';
import { CoreModule } from './core/core.module';
import { UsersModule } from './http/api/v1/users/users.module';
import { AuthModule } from './http/api/v1/auth/auth.module';

const appConfig = appConfiguration();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: appConfig.DB_HOST,
      port: 5432,
      username: appConfig.DB_USERNAME,
      password: appConfig.DB_PASSWORD,
      database: appConfig.DB_NAME,
      entities: [],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([]), 
    CoreModule, 
    CatsModule, 
    UsersModule, 
    AuthModule
  ],
})
export class AppModule { }
