import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.enableCors({
  //   origin: '*',
  // });
  app.enableCors({
    origin: 'http://localhost:3000', // Chỉ cho phép React
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PATCH', 'PUT'], // Chỉ các phương thức cần thiết
    allowedHeaders: ['Content-Type', 'Authorization'], // Chỉ header cần
    credentials: true, // Nếu có cookie, bật cái này
  });

  app.use((req, res, next) => {
    res.removeHeader('Cross-Origin-Opener-Policy');
    res.removeHeader('Cross-Origin-Embedder-Policy');
    next();
  });

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // app.set('trust proxy', 'loopback');
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(80);
}
bootstrap();
