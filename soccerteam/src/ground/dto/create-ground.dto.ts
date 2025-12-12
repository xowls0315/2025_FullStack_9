import { IsString, IsBoolean, IsIn } from 'class-validator';

export class CreateGroundDto {
  @IsString()
  name: string;

  @IsBoolean()
  isAvailable: boolean;

  @IsString()
  address: string;

  @IsIn(['9인용', '10인용', '11인용'], {
    message: 'size는 9인용, 10인용, 11인용 중 하나여야 합니다.',
  })
  size: '9인용' | '10인용' | '11인용';
}
