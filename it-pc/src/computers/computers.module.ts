import { Module } from '@nestjs/common';
import { ComputersService } from './computers.service';
import { ComputersController } from './computers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Computers } from './entities/computer.entity';
import { Usage } from 'src/usage/entities/usage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Computers, Usage])],
  controllers: [ComputersController],
  providers: [ComputersService],
})
export class ComputersModule {}
