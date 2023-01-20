import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { utils } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
  Logger.log(
    `Server Running on http://localhost:${process.env.PORT}/graphql`,
    'Bootstrap',
  );
}

bootstrap()
  .then(() => Logger.log(utils.eadortsu(), 'Eadortsu'))
  .catch((e) => Logger.log(e, 'Server Error'));
