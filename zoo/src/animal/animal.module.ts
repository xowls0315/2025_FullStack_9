import { Module } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from './entities/animal.entity';
import { Zookeeper } from 'src/zookeeper/entities/zookeeper.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Animal, Zookeeper])],
  controllers: [AnimalController],
  providers: [AnimalService],
})
export class AnimalModule {}
