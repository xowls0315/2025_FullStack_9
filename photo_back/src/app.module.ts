import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // 보통 생략 가능하지만 명시 추천
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
