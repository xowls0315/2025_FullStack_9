import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroundService } from './ground.service';
import { CreateGroundDto } from './dto/create-ground.dto';
import { UpdateGroundDto } from './dto/update-ground.dto';

@Controller('ground')
export class GroundController {
  constructor(private readonly groundService: GroundService) {}

  @Post()
  create(@Body() createGroundDto: CreateGroundDto) {
    return this.groundService.create(createGroundDto);
  }

  @Get()
  findAll() {
    return this.groundService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groundService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroundDto: UpdateGroundDto) {
    return this.groundService.update(+id, updateGroundDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groundService.remove(+id);
  }
}
