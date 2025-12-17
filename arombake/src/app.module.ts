import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StaffModule } from './staff/staff.module';
import { GuestModule } from './guest/guest.module';
import { TierModule } from './tier/tier.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // ⭐ .env 사용 선언
    ConfigModule.forRoot({
      isGlobal: true, // 어디서든 ConfigService 사용 가능
    }),

    // ⭐ TypeORM 설정을 ConfigService로 주입
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<number>('DB_PORT')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false, // DB-First니까 false 유지
      }),
    }),

    StaffModule,
    GuestModule,
    TierModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
