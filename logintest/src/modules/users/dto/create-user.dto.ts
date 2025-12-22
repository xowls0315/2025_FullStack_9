import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  nickname: string;
}
