import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepo: Repository<Area>,
  ) {}

  // CREATE
  async create(dto: CreateAreaDto): Promise<Area> {
    // name unique라서 같은 이름이면 충돌 처리(선택)
    const exists = await this.areaRepo.findOne({ where: { name: dto.name } });
    if (exists) {
      throw new ConflictException(`이미 존재하는 지역 이름입니다: ${dto.name}`);
    }

    const area = this.areaRepo.create(dto);
    return this.areaRepo.save(area);
  }

  // READ ALL (area에 속한 foodtrucks도 같이 보고 싶으면 relations 사용)
  async findAll(withFoodtrucks = false): Promise<Area[]> {
    return this.areaRepo.find({
      relations: withFoodtrucks ? { foodtrucks: true } : undefined,
    });
  }

  // READ ONE
  async findOne(id: number, withFoodtrucks = false): Promise<Area> {
    const area = await this.areaRepo.findOne({
      where: { id },
      relations: withFoodtrucks ? { foodtrucks: true } : undefined,
    });
    if (!area) throw new NotFoundException(`${id}번 지역을 찾을 수 없습니다.`);
    return area;
  }

  // UPDATE (안 준 값 유지)
  async update(id: number, dto: UpdateAreaDto): Promise<Area> {
    const area = await this.findOne(id);

    // PATCH 스타일
    area.name = dto.name ?? area.name;
    area.size = dto.size ?? area.size;

    return this.areaRepo.save(area);
  }

  // DELETE
  async remove(id: number): Promise<string> {
    await this.findOne(id);
    await this.areaRepo.delete(id);
    return `${id}번 지역이 삭제되었습니다.`;
  }
}
