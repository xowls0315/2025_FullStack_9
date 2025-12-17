import { Module } from '@nestjs/common';
import { FoodtruckService } from './foodtruck.service';
import { FoodtruckController } from './foodtruck.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Foodtruck } from './entities/foodtruck.entity';
import { Area } from 'src/area/entities/area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Foodtruck, Area])],
  controllers: [FoodtruckController],
  providers: [FoodtruckService],
})
export class FoodtruckModule {}
