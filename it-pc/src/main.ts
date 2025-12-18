import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseFormatInterceptor } from './common/interceptor/response-format.interceptor';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TimeGuard } from './common/guard/time.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 값 제거
      forbidNonWhitelisted: true, // DTO에 없는 값 오면 400
      transform: true, // param string -> number 등 변환
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('it-pc API')
    .setDescription('PC방 관리 API')
    .setVersion('1.0')
    // ✅ Guard 헤더 테스트용 (staff-key)
    .addApiKey(
      { type: 'apiKey', name: 'x-staff-key', in: 'header' },
      'staffKey',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // app.useGlobalGuards(new TimeGuard());
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
