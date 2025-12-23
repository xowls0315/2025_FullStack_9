import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString } from 'class-validator';

export class UpdateNicknameDto extends PartialType(CreateUserDto) {
  @IsString()
  newNickname: string;
}
