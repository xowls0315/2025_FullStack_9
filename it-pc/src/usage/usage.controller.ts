import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsageService } from './usage.service';
import { CreateUsageDto } from './dto/create-usage.dto';
import { UpdateUsageDto } from './dto/update-usage.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('usage')
@Controller('usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @ApiOperation({ summary: '사용 관계 등록 (computerId, guestId)' })
  @ApiCreatedResponse({ description: '등록 성공' })
  @Post()
  create(@Body() createUsageDto: CreateUsageDto) {
    return this.usageService.create(createUsageDto);
  }

  @ApiOperation({ summary: '사용 관계 전체 조회 (관계 포함 가능)' })
  @ApiOkResponse({ description: '조회 성공' })
  @Get()
  findAll() {
    return this.usageService.findAll();
  }

  @ApiOperation({ summary: '사용 관계 단건 조회' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: '조회 성공' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usageService.findOne(+id);
  }

  @ApiOperation({ summary: '사용 관계 수정 (PATCH)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateUsageDto })
  @ApiOkResponse({ description: '수정 성공' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUsageDto) {
    return this.usageService.update(+id, dto);
  }

  @ApiOperation({ summary: '사용 관계 삭제' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: '삭제 성공' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usageService.remove(+id);
  }
}
