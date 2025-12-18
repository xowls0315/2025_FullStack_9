import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, Max } from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({ example: '직원1' })
  @IsString()
  name: string;

  @ApiProperty({ example: 2025, minimum: 1900, maximum: 2100 })
  @IsInt()
  @Min(1900)
  @Max(2100)
  hireYear: number;
}
