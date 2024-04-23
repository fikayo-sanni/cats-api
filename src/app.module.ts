import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsModule } from './http/api/v1/cats/cats.module';
import { CoreModule } from './core/core.module';
import { UsersModule } from './http/api/v1/users/users.module';
import { AuthModule } from './http/api/v1/auth/auth.module';
import { dbdatasource } from './data.source';
import { FavoritesModule } from './http/api/v1/favorites/favorites.module';
import { UserSeeder } from './database/seeder/seeders/user.seeder';
import { SeederService } from './database/seeder/seeder.service';
import { User } from './http/api/v1/users/entities/users.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot(dbdatasource),
    TypeOrmModule.forFeature([User]),
    CoreModule,
    CatsModule,
    UsersModule,
    AuthModule,
    FavoritesModule
  ],
  providers: [UserSeeder, SeederService]
})
export class AppModule { }
