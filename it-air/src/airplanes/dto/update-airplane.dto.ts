import {
  IsString,
  IsInt,
  Min,
  IsArray,
  ValidateNested,
  Matches,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

// 수정용 스케줄 DTO (모든 필드 optional)
export class UpdateFlightScheduleDto {
  @IsOptional()
  @IsString()
  departure?: string;

  @IsOptional()
  @IsString()
  arrival?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'departureDate는 YYYY-MM-DD 형식이어야 합니다. 예: 2025-12-11',
  })
  departureDate?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'departureTime은 HH:MM 형식이어야 합니다. 예: 09:30',
  })
  departureTime?: string;
}

export class UpdateAirplaneDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFlightScheduleDto)
  schedules?: UpdateFlightScheduleDto[];
}
