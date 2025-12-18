import { Module } from '@nestjs/common';
import { UsageService } from './usage.service';
import { UsageController } from './usage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usage } from './entities/usage.entity';
import { Computers } from 'src/computers/entities/computer.entity';
import { Guests } from 'src/guests/entities/guest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usage, Computers, Guests])],
  controllers: [UsageController],
  providers: [UsageService],
})
export class UsageModule {}
