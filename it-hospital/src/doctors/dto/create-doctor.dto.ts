import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  IsIn,
} from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  name: string;

  @IsIn(['외과', '내과', '이비인후과', '안과', '치과', '피부과'], {
    message:
      'major는 외과, 내과, 이비인후과, 안과, 치과, 피부과 중에 하나이여야 합니다.',
  })
  major:
    | '외과'
    | '내과'
    | '이비인후과'
    | '안과'
    | '치과'
    | '성형외과'
    | '피부과';

  @IsArray()
  @ArrayNotEmpty({
    message: 'career에는 최소 1개 이상의 경력이 있어야 합니다.',
  })
  @ArrayMinSize(1)
  @IsString({ each: true })
  career: string[];
}
