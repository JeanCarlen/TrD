import {
  ValidationPipe,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { LoggingInterceptor } from './logger.interceptor';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync} from 'fs'
import * as path from 'path';
import { Create42UserDto } from './users/dto/create-42-user.dto';
import { CreateUserDto } from './users/dto/create-user.dto';
import { LoginUserDto } from './users/dto/login-user.dto';
import { UpdateUserDto } from './users/dto/update-user.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Transcendence Backend')
  .setDescription('Transcendence backend API documentation')
  .addServer('http://localhost:8080/api/', 'Local environment')
  .addServer('https://trd.laendrun.ch/api/', 'Production environment')
  .setVersion('1.0')
  .addTag('transcendence')
  .build();
  const options: SwaggerDocumentOptions =  {
	operationIdFactory: (
	  controllerKey: string,
	  methodKey: string
	) => methodKey,
	extraModels: [Create42UserDto, CreateUserDto, LoginUserDto, UpdateUserDto]
  };
const document = SwaggerModule.createDocument(app, config, options);
const outputPath = path.resolve(process.cwd(), 'swagger.json');
writeFileSync(outputPath, JSON.stringify(document), { encoding: 'utf8'});

  app.enableCors({
    origin: 'https://trd.laendrun.ch/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization, Accept, Cookie, Set-Cookie',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(3001);
}
bootstrap();
