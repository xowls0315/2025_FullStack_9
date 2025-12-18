import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateUsageDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  computerId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  guestId: number;
}
