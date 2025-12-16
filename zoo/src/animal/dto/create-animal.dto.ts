import { IsInt, IsPositive, IsString, Min } from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  name: string;

  @IsString()
  systematics: string;

  @IsInt()
  @Min(0, { message: 'count는 0 이상이어야 합니다.' })
  count: number;

  @IsInt()
  @IsPositive()
  zookeeperId: number;
}
