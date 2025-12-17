import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateGuestDto {
  @ApiProperty({ example: '손정우' })
  @IsString()
  name: string;

  @ApiProperty({ example: 12000, minimum: 0, description: '지출(원)' })
  @IsInt()
  @Min(0)
  spending: number;

  @ApiProperty({ example: 1, description: 'tier PK (BRONZE=1 같은 값)' })
  @IsInt()
  tierId: number;
}
