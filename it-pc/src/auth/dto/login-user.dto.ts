import { IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;
}
