import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: 'http://localhost:3000' },
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(3001);
}
bootstrap();
