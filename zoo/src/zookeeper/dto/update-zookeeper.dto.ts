import { PartialType } from '@nestjs/mapped-types';
import { CreateZookeeperDto } from './create-zookeeper.dto';

export class UpdateZookeeperDto extends PartialType(CreateZookeeperDto) {}
