import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGunDto } from './dto/create-gun.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Guns } from './entities/gun.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GunsService {
  constructor(
    @InjectRepository(Guns)
    private readonly gunsRepo: Repository<Guns>,
  ) {}

  async create(dto: CreateGunDto): Promise<Guns> {
    const gun = this.gunsRepo.create(dto);
    return this.gunsRepo.save(gun);
  }

  async findAll(): Promise<Guns[]> {
    return this.gunsRepo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Guns> {
    const gun = await this.gunsRepo.findOne({ where: { id } });
    if (!gun) throw new NotFoundException(`${id}번 총이 없습니다.`);
    return gun;
  }
}
