import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Guest')
@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @ApiOperation({ summary: '손님 등록' })
  @ApiBody({ type: CreateGuestDto })
  @Post()
  create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestService.create(createGuestDto);
  }

  @ApiOperation({ summary: '손님 전체 조회' })
  @Get()
  findAll() {
    return this.guestService.findAll();
  }

  @ApiOperation({ summary: '손님 단건 조회' })
  @ApiParam({ name: 'id', example: 1, description: 'guest id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guestService.findOne(+id);
  }

  @ApiOperation({ summary: '손님 수정' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateGuestDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGuestDto: UpdateGuestDto) {
    return this.guestService.update(+id, updateGuestDto);
  }

  @ApiOperation({ summary: '손님 삭제' })
  @ApiParam({ name: 'id', example: 1 })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guestService.remove(+id);
  }
}
