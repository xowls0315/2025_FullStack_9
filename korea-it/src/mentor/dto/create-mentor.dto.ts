import { IsIn, IsString } from 'class-validator';

export class CreateMentorDto {
  @IsString()
  name: string;

  @IsIn(['신입', '경력', '팀장'], {
    message: 'position은 신입, 경력, 팀장 중 하나여야 합니다.',
  })
  position: '신입' | '경력' | '팀장';
}
