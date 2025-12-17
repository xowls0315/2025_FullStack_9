import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FoodtruckService } from './foodtruck.service';
import { CreateFoodtruckDto } from './dto/create-foodtruck.dto';
import { UpdateFoodtruckDto } from './dto/update-foodtruck.dto';

@Controller('foodtruck')
export class FoodtruckController {
  constructor(private readonly foodtruckService: FoodtruckService) {}

  @Post()
  create(@Body() createFoodtruckDto: CreateFoodtruckDto) {
    return this.foodtruckService.create(createFoodtruckDto);
  }

  @Get()
  findAll() {
    return this.foodtruckService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodtruckService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFoodtruckDto: UpdateFoodtruckDto) {
    return this.foodtruckService.update(+id, updateFoodtruckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodtruckService.remove(+id);
  }
}
