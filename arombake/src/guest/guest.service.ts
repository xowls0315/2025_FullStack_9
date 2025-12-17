import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Guest } from './entities/guest.entity';
import { Tier } from 'src/tier/entities/tier.entity';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(Guest) private readonly guestRepo: Repository<Guest>,
    @InjectRepository(Tier) private readonly tierRepo: Repository<Tier>,
  ) {}

  async create(dto: CreateGuestDto) {
    const tier = await this.tierRepo.findOne({ where: { id: dto.tierId } });
    if (!tier) throw new NotFoundException(`${dto.tierId}번 tier 없음`);

    const guest = this.guestRepo.create({
      name: dto.name,
      spending: dto.spending,
      tier, // ✅ 관계 설정 (generator가 만든 필드명에 따라 tier/tierId가 다를 수 있음)
    });

    return this.guestRepo.save(guest);
  }

  findAll() {
    return this.guestRepo.find({ relations: ['tier'] });
  }

  async findOne(id: number) {
    const guest = await this.guestRepo.findOne({
      where: { id },
      relations: ['tier'],
    });
    if (!guest) throw new NotFoundException(`${id}번 guest 없음`);
    return guest;
  }

  async update(id: number, dto: UpdateGuestDto) {
    const guest = await this.findOne(id);

    guest.name = dto.name ?? guest.name;
    guest.spending = dto.spending ?? guest.spending;

    if (dto.tierId !== undefined) {
      const tier = await this.tierRepo.findOne({ where: { id: dto.tierId } });
      if (!tier) throw new NotFoundException(`${dto.tierId}번 tier 없음`);
      guest.tier = tier;
    }

    return this.guestRepo.save(guest);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.guestRepo.delete(id);
    return `${id}번 guest 삭제됨`;
  }
}
