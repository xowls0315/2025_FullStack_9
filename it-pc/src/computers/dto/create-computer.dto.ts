import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Min } from 'class-validator';

export enum ComputerSpec {
  GOOD = '좋음',
  NORMAL = '보통',
  BAD = '나쁨',
}
export enum ComputerStatus {
  OK = '양호',
  BROKEN = '고장',
  REPAIRING = '수리중',
}

export class CreateComputerDto {
  @ApiProperty({ enum: ComputerSpec, example: ComputerSpec.GOOD })
  @IsEnum(ComputerSpec)
  spec: ComputerSpec;

  @ApiProperty({ example: 1000, minimum: 1 })
  @IsInt()
  @Min(1)
  price: number;

  @ApiProperty({ enum: ComputerStatus, example: ComputerStatus.OK })
  @IsEnum(ComputerStatus)
  status: ComputerStatus;
}
