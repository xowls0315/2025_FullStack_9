import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  nickname?: string;

  // 기존 비밀번호
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  password?: string;

  // 새 비밀번호
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  newPassword?: string;
}
