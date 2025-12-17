import { Controller, Get } from '@nestjs/common';
import { TierService } from './tier.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Tier')
@Controller('tier')
export class TierController {
  constructor(private readonly tierService: TierService) {}

  @ApiOperation({ summary: '티어 전체 조회 (고정값 BRONZE/SILVER/GOLD)' })
  @Get()
  findAll() {
    return this.tierService.findAll();
  }
}
