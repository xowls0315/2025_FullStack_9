import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirplanesModule } from './airplanes/airplanes.module';
import { PassengersModule } from './passengers/passengers.module';

@Module({
  imports: [AirplanesModule, PassengersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
