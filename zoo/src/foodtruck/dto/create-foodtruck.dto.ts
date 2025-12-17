import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateFoodtruckDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsString()
  @IsNotEmpty()
  main: string;

  @IsString()
  @IsNotEmpty()
  subs: string;

  // DB가 areas_id nullable 이라서 선택값으로 둠
  // (area에 반드시 속해야 한다면 @IsOptional 빼고 nullable도 false로 바꾸는 게 정석)
  @IsOptional()
  @IsInt()
  @Min(1)
  areasId?: number;
}
