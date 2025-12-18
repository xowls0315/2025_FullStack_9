import { Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staffs } from './entities/staff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Staffs])],
  controllers: [StaffsController],
  providers: [StaffsService],
})
export class StaffsModule {}
