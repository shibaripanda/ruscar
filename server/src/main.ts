import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  const PORT = config.get<string>('PORT')!;
  const APPNAME = config.get<string>('APPNAME')!;
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.set('trust proxy', true);
  app.use(express.static(join(__dirname, '..', 'public')));
  await app.listen(PORT, () => {
    console.log(`Server ${APPNAME} started on port = ${PORT}`);
  });
  process.once('SIGINT', () => void app.close());
  process.once('SIGTERM', () => void app.close());
}
void bootstrap();
