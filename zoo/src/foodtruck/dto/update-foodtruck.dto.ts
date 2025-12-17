import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodtruckDto } from './create-foodtruck.dto';

export class UpdateFoodtruckDto extends PartialType(CreateFoodtruckDto) {}
