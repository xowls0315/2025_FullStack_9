import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Guests } from './entities/guest.entity';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guests)
    private readonly guestRepo: Repository<Guests>,
  ) {}

  async create(dto: CreateGuestDto): Promise<Guests> {
    const guest = this.guestRepo.create(dto);
    return this.guestRepo.save(guest);
  }

  async findAll(): Promise<Guests[]> {
    return this.guestRepo.find();
  }

  async findOne(id: number): Promise<Guests> {
    const guest = await this.guestRepo.findOne({ where: { id } });
    if (!guest) throw new NotFoundException(`${id}번 손님을 찾을 수 없습니다.`);
    return guest;
  }

  async update(id: number, dto: UpdateGuestDto): Promise<Guests> {
    const guest = await this.findOne(id);

    guest.name = dto.name ?? guest.name;
    guest.password = dto.password ?? guest.password;
    guest.age = dto.age ?? guest.age;

    return this.guestRepo.save(guest);
  }

  async remove(id: number): Promise<string> {
    await this.findOne(id);
    await this.guestRepo.delete(id);
    return `${id}번 손님이 삭제되었습니다.`;
  }
}
