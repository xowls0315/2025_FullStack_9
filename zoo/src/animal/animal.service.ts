import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from './entities/animal.entity';
import { Zookeeper } from 'src/zookeeper/entities/zookeeper.entity';

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(Animal) private readonly animalRepo: Repository<Animal>,
    @InjectRepository(Zookeeper)
    private readonly zookeeperRepo: Repository<Zookeeper>,
  ) {}

  async create(dto: CreateAnimalDto): Promise<Animal> {
    const zookeeper = await this.zookeeperRepo.findOne({
      where: { id: dto.zookeeperId },
    });
    if (!zookeeper) {
      throw new NotFoundException(`${dto.zookeeperId}번 조련사가 없습니다.`);
    }

    const animal = this.animalRepo.create({
      name: dto.name,
      systematics: dto.systematics,
      count: dto.count,
      zookeeper, // ✅ 바로 연결
    });

    return this.animalRepo.save(animal);
  }

  // ✅ READ ALL: zookeeper 관계 포함
  async findAll(): Promise<Animal[]> {
    return this.animalRepo.find(); // zookeeper 객체 없이 zookeeperId만(대개) 노출
  }

  // ✅ READ ONE: zookeeper 관계 포함
  async findOne(id: number): Promise<Animal> {
    const animal = await this.animalRepo.findOne({
      where: { id },
      relations: { zookeeper: true },
    });

    if (!animal) {
      throw new NotFoundException(`${id}번 동물을 찾을 수 없습니다.`);
    }
    return animal;
  }

  // ✅ UPDATE: (필요하면 조련사 변경도 가능하게)
  async update(id: number, dto: UpdateAnimalDto): Promise<Animal> {
    const animal = await this.findOne(id);

    animal.name = dto.name ?? animal.name;
    animal.systematics = dto.systematics ?? animal.systematics;
    animal.count = dto.count ?? animal.count;

    // ⭐ UpdateAnimalDto에 zookeeperId? 를 넣었다면 조련사 변경도 가능
    if ((dto as any).zookeeperId !== undefined) {
      const zk = await this.zookeeperRepo.findOne({
        where: { id: (dto as any).zookeeperId },
      });
      if (!zk) {
        throw new NotFoundException(
          `${(dto as any).zookeeperId}번 조련사가 없습니다.`,
        );
      }
      animal.zookeeper = zk;
    }

    return this.animalRepo.save(animal);
  }

  // ✅ DELETE: 관계 있어도 삭제는 그냥 가능
  async remove(id: number): Promise<string> {
    await this.findOne(id);
    await this.animalRepo.delete(id);
    return `${id}번 동물이 삭제되었습니다.`;
  }
}
