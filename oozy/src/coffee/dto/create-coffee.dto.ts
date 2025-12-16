import { IsInt, IsString, Min } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(0, { message: 'price는 0 이상이어야 합니다.' })
  price: number;

  @IsInt()
  @Min(0, { message: 'shots는 0 이상이어야 합니다.' })
  shots: number;
}
