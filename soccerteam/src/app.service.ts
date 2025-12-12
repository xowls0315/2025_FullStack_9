import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '조기축구 동호회에 오신걸 환영합니다!!';
  }
}
