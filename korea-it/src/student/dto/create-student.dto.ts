import { IsInt, IsString, Matches, Min } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  age: number;

  // 한국 휴대폰 형식 간단 검증(예: 010-1234-5678)
  @Matches(/^01[016789]-\d{3,4}-\d{4}$/, {
    message: 'phone은 010-1234-5678 형식이어야 합니다.',
  })
  phone: string;
}
