import { Module } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usage } from 'src/usage/entities/usage.entity';
import { Guests } from './entities/guest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guests, Usage])],
  controllers: [GuestsController],
  providers: [GuestsService],
})
export class GuestsModule {}
