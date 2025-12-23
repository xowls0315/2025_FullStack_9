import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { validationConfig } from './configs/validation.config';
import { corsConfig } from './configs/cors.config';
import cookieParser from 'cookie-parser';
import { ResponseFormatInterceptor } from './common/interceptor/response-format.interceptor';
import { AllExceptionFilter } from './common/filter/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors(corsConfig);
  app.useGlobalPipes(new ValidationPipe(validationConfig));
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
