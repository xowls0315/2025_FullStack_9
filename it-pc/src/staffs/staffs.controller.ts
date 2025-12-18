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
import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';

@ApiTags('staffs')
@ApiSecurity('staffKey')
@UseGuards(AuthGuard) // ✅ staffs 전체를 staff-only로
@Controller('staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

  @ApiOperation({ summary: '직원 등록 (staff-only)' })
  @ApiCreatedResponse({ description: '등록 성공' })
  @Post()
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffsService.create(createStaffDto);
  }

  @ApiOperation({ summary: '직원 전체 조회 (staff-only)' })
  @ApiOkResponse({ description: '조회 성공' })
  @Get()
  findAll() {
    return this.staffsService.findAll();
  }

  @ApiOperation({ summary: '직원 단건 조회 (staff-only)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: '조회 성공' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffsService.findOne(+id);
  }

  @ApiOperation({ summary: '직원 수정 (PATCH, staff-only)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateStaffDto })
  @ApiOkResponse({ description: '수정 성공' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffsService.update(+id, updateStaffDto);
  }

  @ApiOperation({ summary: '직원 삭제 (staff-only)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: '삭제 성공' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffsService.remove(+id);
  }
}
