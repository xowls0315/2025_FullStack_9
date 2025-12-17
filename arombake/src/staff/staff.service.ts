import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff } from './entities/staff.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff) private readonly staffRepo: Repository<Staff>,
  ) {}

  create(dto: CreateStaffDto) {
    const staff = this.staffRepo.create(dto as any);
    return this.staffRepo.save(staff);
  }

  findAll() {
    return this.staffRepo.find();
  }

  async findOne(id: number) {
    const staff = await this.staffRepo.findOne({ where: { id } });
    if (!staff) throw new NotFoundException(`${id}번 staff 없음`);
    return staff;
  }

  async update(id: number, dto: UpdateStaffDto) {
    const staff = await this.findOne(id);

    (staff as any).name = dto.name ?? (staff as any).name;
    (staff as any).age = dto.age ?? (staff as any).age;
    (staff as any).hireYear = dto.hireYear ?? (staff as any).hireYear;

    return this.staffRepo.save(staff);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.staffRepo.delete(id);
    return `${id}번 staff 삭제됨`;
  }
}
