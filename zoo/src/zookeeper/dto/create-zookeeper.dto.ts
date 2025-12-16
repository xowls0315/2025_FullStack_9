import { IsEnum, IsInt, IsPositive, IsString } from 'class-validator';
import { ZookeeperPosition } from '../entities/zookeeper.entity';

export class CreateZookeeperDto {
  @IsString()
  name: string;

  @IsInt()
  @IsPositive()
  age: number;

  @IsEnum(ZookeeperPosition, {
    message: 'position은 INTERN | STAFF | LEAD | MANAGER 중 하나여야 합니다.',
  })
  position: ZookeeperPosition;
}
