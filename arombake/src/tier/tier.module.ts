import { Module } from '@nestjs/common';
import { TierService } from './tier.service';
import { TierController } from './tier.controller';
import { Tier } from './entities/tier.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Tier])],
  controllers: [TierController],
  providers: [TierService],
})
export class TierModule {}
