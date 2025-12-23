import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto extends PartialType(CreateUserDto) {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: '비밀번호는 8자 이상, 최대 20자 이하이며, 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.',
  })
  newPassword: string;
}
