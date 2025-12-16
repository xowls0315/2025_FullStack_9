import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimalModule } from './animal/animal.module';
import { ZookeeperModule } from './zookeeper/zookeeper.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'zoo',
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 전체 엔티티 등록
    }),
    AnimalModule,
    ZookeeperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
