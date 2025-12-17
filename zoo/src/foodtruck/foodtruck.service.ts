import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFoodtruckDto } from './dto/create-foodtruck.dto';
import { UpdateFoodtruckDto } from './dto/update-foodtruck.dto';
import { Foodtruck } from './entities/foodtruck.entity';
import { Area } from 'src/area/entities/area.entity';

@Injectable()
export class FoodtruckService {
  constructor(
    @InjectRepository(Foodtruck)
    private readonly foodtruckRepo: Repository<Foodtruck>,

    @InjectRepository(Area)
    private readonly areaRepo: Repository<Area>,
  ) {}

  // CREATE
  async create(dto: CreateFoodtruckDto): Promise<Foodtruck> {
    const foodtruck = this.foodtruckRepo.create({
      name: dto.name,
      owner: dto.owner,
      main: dto.main,
      subs: dto.subs,
    });

    // areasId를 줬다면 관계 연결
    if (dto.areasId !== undefined) {
      const area = await this.areaRepo.findOne({ where: { id: dto.areasId } });
      if (!area)
        throw new NotFoundException(`${dto.areasId}번 지역이 없습니다.`);
      foodtruck.areas = area; // ✅ 이걸 해야 FK(areas_id)가 들어감
    }

    return this.foodtruckRepo.save(foodtruck);
  }

  // READ ALL (area 정보까지 보고 싶으면 relations)
  async findAll(withArea = false): Promise<Foodtruck[]> {
    return this.foodtruckRepo.find({
      relations: withArea ? { areas: true } : undefined,
    });
  }

  // READ ONE
  async findOne(id: number, withArea = false): Promise<Foodtruck> {
    const ft = await this.foodtruckRepo.findOne({
      where: { id },
      relations: withArea ? { areas: true } : undefined,
    });
    if (!ft)
      throw new NotFoundException(`${id}번 푸드트럭을 찾을 수 없습니다.`);
    return ft;
  }

  // UPDATE (안 준 값 유지)
  async update(id: number, dto: UpdateFoodtruckDto): Promise<Foodtruck> {
    const ft = await this.findOne(id);

    ft.name = dto.name ?? ft.name;
    ft.owner = dto.owner ?? ft.owner;
    ft.main = dto.main ?? ft.main;
    ft.subs = dto.subs ?? ft.subs;

    // areasId가 오면 관계 변경
    if (dto.areasId !== undefined) {
      const area = await this.areaRepo.findOne({ where: { id: dto.areasId } });
      if (!area)
        throw new NotFoundException(`${dto.areasId}번 지역이 없습니다.`);
      ft.areas = area;
    }

    return this.foodtruckRepo.save(ft);
  }

  // DELETE
  async remove(id: number): Promise<string> {
    await this.findOne(id);
    await this.foodtruckRepo.delete(id);
    return `${id}번 푸드트럭이 삭제되었습니다.`;
  }
}
