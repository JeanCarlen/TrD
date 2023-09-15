import { ValidationPipe, BadRequestException, ValidationError } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //app.setGlobalPrefix('api')
  app.enableCors({
    origin: 'http://localhost:8000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization, Accept, Cookie, Set-Cookie',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
	whitelist: true,
	forbidNonWhitelisted: true
  }));
  await app.listen(3001);
}
bootstrap();
