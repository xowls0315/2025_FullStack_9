import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateZookeeperDto } from './dto/create-zookeeper.dto';
import { UpdateZookeeperDto } from './dto/update-zookeeper.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zookeeper } from './entities/zookeeper.entity';

@Injectable()
export class ZookeeperService {
  constructor(
    @InjectRepository(Zookeeper)
    private readonly zookeeperRepo: Repository<Zookeeper>,
  ) {}

  async create(dto: CreateZookeeperDto): Promise<Zookeeper> {
    const zk = this.zookeeperRepo.create(dto);
    return this.zookeeperRepo.save(zk);
  }

  async findAll(): Promise<Zookeeper[]> {
    return this.zookeeperRepo.find({
      relations: { animals: true },
    });
  }

  async findOne(id: number): Promise<Zookeeper> {
    const zk = await this.zookeeperRepo.findOne({
      where: { id },
      relations: { animals: true },
    });
    if (!zk) throw new NotFoundException(`${id}번 사육사를 찾을 수 없습니다.`);
    return zk;
  }

  async update(id: number, dto: UpdateZookeeperDto): Promise<Zookeeper> {
    const zk = await this.findOne(id);

    zk.name = dto.name ?? zk.name;
    zk.age = dto.age ?? zk.age;
    zk.position = dto.position ?? zk.position;

    return this.zookeeperRepo.save(zk);
  }

  async remove(id: number): Promise<string> {
    const zk = await this.zookeeperRepo.findOne({
      where: { id },
      relations: { animals: true },
    });
    if (!zk) throw new NotFoundException(`${id}번 사육사를 찾을 수 없습니다.`);

    if (zk.animals.length > 0) {
      throw new NotFoundException(
        `${id}번 사육사는 담당 동물이 있어 삭제할 수 없습니다. 먼저 동물을 다른 사육사로 변경하거나 삭제하세요.`,
      );
    }

    await this.zookeeperRepo.delete(id);
    return `${id}번 사육사가 삭제되었습니다.`;
  }
}
