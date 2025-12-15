import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotionService } from './notion.service';
import { CreateNotionDto } from './dto/create-notion.dto';
import { UpdateNotionDto } from './dto/update-notion.dto';

@Controller('notion')
export class NotionController {
  constructor(private readonly notionService: NotionService) {}

  @Post()
  create(@Body() createNotionDto: CreateNotionDto) {
    return this.notionService.create(createNotionDto);
  }

  @Post('/add')
  add() {
    return this.notionService.addData();
  }

  @Post('/kakao')
  createKakao(@Body() createNotionDto: CreateNotionDto) {
    return this.notionService.createKakaoDailyDb();
  }

  @Get('/kakao')
  kakaoLog() {
    return this.notionService.kakaoLog();
  }

  @Post('/kakao2')
  createKakao2(@Body() createNotionDto: CreateNotionDto) {
    return this.notionService.createKakaoDailyDb2();
  }

  @Get('/kakao2')
  kakaoLog2() {
    return this.notionService.kakaoLog2();
  }
}
