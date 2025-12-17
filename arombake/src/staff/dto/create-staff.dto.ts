import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({ example: '황태진' })
  @IsString()
  name: string;

  @ApiProperty({ example: 25, minimum: 0 })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({ example: 2021, description: '입사년도(연도만)' })
  @IsInt()
  hireYear: number;
}
