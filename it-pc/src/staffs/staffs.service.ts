import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staffs } from './entities/staff.entity';

@Injectable()
export class StaffsService {
  constructor(
    @InjectRepository(Staffs)
    private readonly staffRepo: Repository<Staffs>,
  ) {}

  async create(dto: CreateStaffDto): Promise<Staffs> {
    const staff = this.staffRepo.create(dto);
    return this.staffRepo.save(staff);
  }

  async findAll(): Promise<Staffs[]> {
    return this.staffRepo.find();
  }

  async findOne(id: number): Promise<Staffs> {
    const staff = await this.staffRepo.findOne({ where: { id } });
    if (!staff) throw new NotFoundException(`${id}번 직원이 없습니다.`);
    return staff;
  }

  async update(id: number, dto: UpdateStaffDto): Promise<Staffs> {
    const staff = await this.findOne(id);

    staff.name = dto.name ?? staff.name;
    staff.hireYear = dto.hireYear ?? staff.hireYear;

    return this.staffRepo.save(staff);
  }

  async remove(id: number): Promise<string> {
    await this.findOne(id);
    await this.staffRepo.delete(id);
    return `${id}번 직원이 삭제되었습니다.`;
  }
}
