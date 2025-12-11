import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // // 퀴즈
  // // 오브젝트 타입 {name: "점심 디저트", price: ???} 돌려줌
  // @Get('quiz')
  // getQuiz(): object {
  //   return {
  //     name: '점심 디저트',
  //     price: 2500,
  //   };
  // }

  // // 동적 파라미터
  // // /coffee/1, 2, 3
  // // 1 => {name: "아메리카노", price: 1500}
  // // 2 => {name: "라떼", price: 2500}
  // // 3 => {name: "모카", price: 3500}
  // @Get('coffee/:id')
  // getCoffee(@Param('id') id: string) {
  //   const coffeeId = Number(id);

  //   const coffeeList = [
  //     { id: 1, name: '아메리카노', price: 1500 },
  //     { id: 2, name: '라떼', price: 2500 },
  //     { id: 3, name: '모카', price: 3500 },
  //   ];

  //   return (
  //     coffeeList.find((c) => c.id === coffeeId) ?? {
  //       message: '없는 메뉴입니다.',
  //     }
  //   );
  // }

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/lunch')
  getLunch(): string {
    return this.appService.getLunch();
  }
}
