import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateAreaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1, { message: 'size는 1 이상이어야 합니다.' })
  size: number;
}
