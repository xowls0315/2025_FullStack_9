import { IsString, IsIn } from 'class-validator';

export class CreatePassengerDto {
  @IsString()
  name: string;

  @IsString()
  passport: string;

  @IsIn(['BRONZE', 'SILVER', 'GOLD'], {
    message: 'membership은 BRONZE, SILVER, GOLD 중 하나여야 합니다.',
  })
  membership: 'BRONZE' | 'SILVER' | 'GOLD'; // ← 여기!
}
