import { Module } from '@nestjs/common';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { Guest } from './entities/guest.entity';
import { Tier } from 'src/tier/entities/tier.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Guest, Tier])],
  controllers: [GuestController],
  providers: [GuestService],
})
export class GuestModule {}
