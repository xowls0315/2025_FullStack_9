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
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RabbitGuard } from 'src/common/guard/rabbit.guard';

@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @ApiOperation({ summary: '직원 등록' })
  @ApiBody({ type: CreateStaffDto })
  @Post()
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @ApiOperation({ summary: '직원 전체 조회' })
  @Get()
  @UseGuards(RabbitGuard)
  findAll() {
    return this.staffService.findAll();
  }

  @ApiOperation({ summary: '직원 단건 조회' })
  @ApiParam({ name: 'id', example: 1, description: 'staff id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(+id);
  }

  @ApiOperation({ summary: '직원 수정' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateStaffDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(+id, updateStaffDto);
  }

  @ApiOperation({ summary: '직원 삭제' })
  @ApiParam({ name: 'id', example: 1 })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(+id);
  }
}
