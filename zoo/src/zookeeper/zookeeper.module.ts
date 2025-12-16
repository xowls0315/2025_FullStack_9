import { Module } from '@nestjs/common';
import { ZookeeperService } from './zookeeper.service';
import { ZookeeperController } from './zookeeper.controller';
import { Zookeeper } from './entities/zookeeper.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Zookeeper])],
  controllers: [ZookeeperController],
  providers: [ZookeeperService],
})
export class ZookeeperModule {}
