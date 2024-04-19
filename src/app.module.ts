import { Module } from '@nestjs/common';
import { CatsModule } from './http/api/v1/cats/cats.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule, CatsModule],
})
export class AppModule {}
