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
import { ComputersService } from './computers.service';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiSecurity,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';

@ApiTags('computers')
@Controller('computers')
export class ComputersController {
  constructor(private readonly computersService: ComputersService) {}

  @ApiSecurity('staffKey')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '컴퓨터 등록 (staff-only)' })
  @ApiCreatedResponse({ description: '등록 성공' })
  @Post()
  create(@Body() createComputerDto: CreateComputerDto) {
    return this.computersService.create(createComputerDto);
  }

  @ApiOperation({ summary: '컴퓨터 전체 조회' })
  @ApiOkResponse({ description: '조회 성공' })
  @Get()
  findAll() {
    return this.computersService.findAll();
  }

  @ApiOperation({ summary: '컴퓨터 단건 조회' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: '조회 성공' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.computersService.findOne(+id);
  }

  @ApiSecurity('staffKey')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '컴퓨터 수정 (PATCH, staff-only)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateComputerDto })
  @ApiOkResponse({ description: '수정 성공' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComputerDto: UpdateComputerDto,
  ) {
    return this.computersService.update(+id, updateComputerDto);
  }

  @ApiSecurity('staffKey')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '컴퓨터 삭제 (staff-only)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: '삭제 성공' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.computersService.remove(+id);
  }
}
