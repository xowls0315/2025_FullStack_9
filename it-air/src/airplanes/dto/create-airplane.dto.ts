import {
  IsString,
  IsInt,
  Min,
  IsArray,
  ValidateNested,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

// 생성용 스케줄 DTO
export class CreateFlightScheduleDto {
  @IsString()
  departure: string;

  @IsString()
  arrival: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'departureDate는 YYYY-MM-DD 형식이어야 합니다. 예: 2025-12-11',
  })
  departureDate: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'departureTime은 HH:MM 형식이어야 합니다. 예: 09:30',
  })
  departureTime: string;
}

export class CreateAirplaneDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFlightScheduleDto)
  schedules: CreateFlightScheduleDto[];
}
