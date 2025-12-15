import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { StudentModule } from './student/student.module';
import { MentorModule } from './mentor/mentor.module';
import { NotionModule } from './notion/notion.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    RoomModule,
    StudentModule,
    MentorModule,
    NotionModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
