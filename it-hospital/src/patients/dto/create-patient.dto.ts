import { IsString, IsIn } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  name: string;

  @IsString()
  injury: string;

  @IsIn(['경상', '부상', '중상', '심정지'], {
    message: 'severity는 경상, 부상, 중상, 심정지 중 하나여야 합니다.',
  })
  severity: '경상' | '부상' | '중상' | '심정지';
}
