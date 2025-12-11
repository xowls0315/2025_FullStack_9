import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 필드는 자동 제거
      forbidNonWhitelisted: true, // DTO에 정의 안 된 필드 들어오면 에러
      transform: true, // 문자열을 number 등으로 자동 변환
    }),
  );

  await app.listen(3000);
}
bootstrap();
