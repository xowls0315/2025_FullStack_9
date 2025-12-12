import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroundDto } from './dto/create-ground.dto';
import { UpdateGroundDto } from './dto/update-ground.dto';
import { Ground } from './entities/ground.entity';

@Injectable()
export class GroundService {
  // 메모리 DB 역할
  private grounds: Ground[] = [
    {
      id: 1,
      name: '상동 풋살장 A',
      isAvailable: true,
      address: '경기도 부천시 상동 123-4',
      size: '10인용',
    },
  ];

  private nextId =
    this.grounds.length > 0
      ? Math.max(...this.grounds.map((g) => g.id)) + 1
      : 1;

  // CREATE
  create(createGroundDto: CreateGroundDto): Ground {
    const newGround: Ground = {
      id: this.nextId++,
      name: createGroundDto.name,
      isAvailable: createGroundDto.isAvailable,
      address: createGroundDto.address,
      size: createGroundDto.size,
    };

    this.grounds.push(newGround);
    return newGround;
  }

  // READ ALL
  findAll(): Ground[] {
    return this.grounds;
  }

  // READ ONE
  findOne(id: number): Ground {
    const ground = this.grounds.find((g) => g.id === id);
    if (!ground)
      throw new NotFoundException(`${id}번 구장을 찾을 수 없습니다.`);
    return ground;
  }

  // UPDATE (PATCH/PUT 둘 다 "안 준 값 유지" 방식)
  update(id: number, updateGroundDto: UpdateGroundDto): Ground {
    const ground = this.findOne(id);

    ground.name = updateGroundDto.name ?? ground.name;
    ground.isAvailable = updateGroundDto.isAvailable ?? ground.isAvailable;
    ground.address = updateGroundDto.address ?? ground.address;
    ground.size = updateGroundDto.size ?? ground.size;

    return ground;
  }

  // DELETE
  remove(id: number): string {
    const index = this.grounds.findIndex((g) => g.id === id);
    if (index === -1)
      throw new NotFoundException(`${id}번 구장을 찾을 수 없습니다.`);

    this.grounds.splice(index, 1);
    return `${id}번 구장이 삭제되었습니다.`;
  }
}
