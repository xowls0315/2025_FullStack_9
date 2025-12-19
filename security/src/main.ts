import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './configs/cors.config';
import { ValidationPipe } from '@nestjs/common';
import { validationConfig } from './configs/validation.config';

import { ResponseFormatInterceptor } from './common/interceptor/response-format.interceptor';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors(corsConfig);
  app.useGlobalPipes(new ValidationPipe(validationConfig));
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
