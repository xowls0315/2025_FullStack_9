import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenusModule } from './menus/menus.module';
import { StaffsModule } from './staffs/staffs.module';

@Module({
  imports: [MenusModule, StaffsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
