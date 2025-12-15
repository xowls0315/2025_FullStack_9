import { IsIn, IsInt, Min } from 'class-validator';

export class CreateRoomDto {
  @IsIn(['A', 'B', 'C', 'D', 'E'], { message: 'A~E만 허용됩니다.' })
  name: string;

  @IsInt()
  @Min(1, { message: 'capacity는 1 이상이어야 합니다.' })
  capacity: number;
}
