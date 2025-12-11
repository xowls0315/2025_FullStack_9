import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello NestJS!';
  }
  getLunch(): string {
    return '딜리셔스한 Lunch!!!';
  }
}
