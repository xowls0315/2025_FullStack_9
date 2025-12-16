import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ZookeeperService } from './zookeeper.service';
import { CreateZookeeperDto } from './dto/create-zookeeper.dto';
import { UpdateZookeeperDto } from './dto/update-zookeeper.dto';

@Controller('zookeeper')
export class ZookeeperController {
  constructor(private readonly zookeeperService: ZookeeperService) {}

  @Post()
  create(@Body() createZookeeperDto: CreateZookeeperDto) {
    return this.zookeeperService.create(createZookeeperDto);
  }

  @Get()
  findAll() {
    return this.zookeeperService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zookeeperService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZookeeperDto: UpdateZookeeperDto) {
    return this.zookeeperService.update(+id, updateZookeeperDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zookeeperService.remove(+id);
  }
}
