import { IsString, IsIn, IsDateString } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  name: string;

  @IsIn(['바리스타', '슈퍼바이저', '점장', '부점장'], {
    message:
      'position은 바리스타, 슈퍼바이저, 점장, 부점장 중 하나여야 합니다.',
  })
  position: '바리스타' | '슈퍼바이저' | '점장' | '부점장';

  // '2025-12-11' 같은 형식의 문자열을 받기
  @IsDateString({}, { message: 'startDate는 YYYY-MM-DD 형식이어야 합니다.' })
  startDate: string;
}
