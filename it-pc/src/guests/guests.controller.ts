import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { IpGuard } from 'src/common/guard/ip.guard';

@ApiTags('guests')
@UseGuards(IpGuard)
@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @ApiOperation({ summary: '손님 등록' })
  @ApiCreatedResponse({ description: '등록 성공' })
  @Post()
  create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestsService.create(createGuestDto);
  }

  @ApiOperation({ summary: '손님 전체 조회' })
  @ApiOkResponse({ description: '조회 성공' })
  @Get()
  findAll() {
    return this.guestsService.findAll();
  }

  @ApiOperation({ summary: '손님 단건 조회' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: '조회 성공' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guestsService.findOne(+id);
  }

  @ApiOperation({ summary: '손님 수정 (PATCH)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateGuestDto })
  @ApiOkResponse({ description: '수정 성공' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGuestDto: UpdateGuestDto) {
    return this.guestsService.update(+id, updateGuestDto);
  }

  @ApiOperation({ summary: '손님 삭제' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: '삭제 성공' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guestsService.remove(+id);
  }
}
