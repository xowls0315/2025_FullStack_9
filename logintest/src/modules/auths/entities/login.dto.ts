import { IsNumber, IsString } from 'class-validator';

export class LoginDto {
  @IsNumber()
  id: number;

  @IsString()
  password: string;
}
