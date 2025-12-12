import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateMemberDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  @Min(25)
  age: number;

  @IsArray()
  @ArrayNotEmpty({ message: 'position은 최소 1개 이상이어야 합니다.' })
  @IsIn(['골키퍼', '수비수', '미드필더', '공격수'], {
    each: true,
    message: 'position에는 골키퍼/수비수/미드필더/공격수만 넣을 수 있습니다.',
  })
  position: ('골키퍼' | '수비수' | '미드필더' | '공격수')[];
}
