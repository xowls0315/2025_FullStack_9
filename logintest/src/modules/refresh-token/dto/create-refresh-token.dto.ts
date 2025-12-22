import { IsInt, IsString, MinLength } from 'class-validator';

export class CreateRefreshTokenDto {
  @IsInt()
  userId: number;

  @IsString()
  @MinLength(10)
  token: string; // 원문 refresh token (DB에는 hashedToken으로 저장)
}
