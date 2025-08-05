import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
dotenv.config()
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express'
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.enableCors({ origin: '*', })
  const port = process.env.PORT || 3000;
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  )
  await app.listen(port, '0.0.0.0');
}
bootstrap();
