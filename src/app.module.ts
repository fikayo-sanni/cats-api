import { Module } from '@nestjs/common';
import { CatsModule } from './http/api/v1/cats/cats.module';
import { CoreModule } from './core/core.module';
import { UsersModule } from './http/api/v1/users/users.module';
import { AuthModule } from './http/api/v1/auth/auth.module';

@Module({
  imports: [CoreModule, CatsModule, UsersModule, AuthModule],
})
export class AppModule {}
