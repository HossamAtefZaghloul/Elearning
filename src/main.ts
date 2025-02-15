import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  //  \|/-:--:[-Security-]:--:-\|/
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000, // 10Min
      max: 100, // Limit: 100 request per window
      message: 'Too many requests, please try again later.',
    }),
  );
  app.use(helmet());
  // Global-Pipes: enables strict ((DTO)) validation and transformation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3005);
  console.log('Startedddd');
}
bootstrap();
