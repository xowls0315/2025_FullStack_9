import { PartialType } from '@nestjs/mapped-types';
import { CreateAnimalDto } from './create-animal.dto';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateAnimalDto extends PartialType(CreateAnimalDto) {
  @IsOptional()
  @IsInt()
  @IsPositive()
  zookeeperId?: number;
}
