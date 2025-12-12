import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule } from './member/member.module';
import { GroundModule } from './ground/ground.module';

@Module({
  imports: [MemberModule, GroundModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
