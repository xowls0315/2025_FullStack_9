import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { GunsService } from './guns.service';
import { CreateGunDto } from './dto/create-gun.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@Controller('guns')
export class GunsController {
  constructor(private readonly gunsService: GunsService) {}

  @Post()
  create(@Body() createGunDto: CreateGunDto) {
    return this.gunsService.create(createGunDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.gunsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.gunsService.findOne(+id);
  }
}
