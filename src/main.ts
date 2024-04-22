import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfiguration from 'src/common/config/envs/app.config';
import * as passport from 'passport';

const validationPipeService = require('@pipets/validation-pipes');

const appConfig = appConfiguration();
async function bootstrap() {
  try {
    validationPipeService();
    const app = await NestFactory.create(AppModule);

    app.use(passport.initialize());
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(appConfig.PORT);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch(err) {

  }
}
bootstrap();
