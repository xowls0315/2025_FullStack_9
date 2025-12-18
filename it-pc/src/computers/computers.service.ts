import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
import { Computers } from './entities/computer.entity';

@Injectable()
export class ComputersService {
  constructor(
    @InjectRepository(Computers)
    private readonly computerRepo: Repository<Computers>,
  ) {}

  async create(dto: CreateComputerDto): Promise<Computers> {
    const computer = this.computerRepo.create(dto);
    return this.computerRepo.save(computer);
  }

  async findAll(): Promise<Computers[]> {
    return this.computerRepo.find();
  }

  async findOne(id: number): Promise<Computers> {
    const computer = await this.computerRepo.findOne({ where: { id } });
    if (!computer)
      throw new NotFoundException(`${id}번 컴퓨터를 찾을 수 없습니다.`);
    return computer;
  }

  async update(id: number, dto: UpdateComputerDto): Promise<Computers> {
    const computer = await this.findOne(id);

    computer.spec = dto.spec ?? computer.spec;
    computer.price = dto.price ?? computer.price;
    computer.status = dto.status ?? computer.status;

    return this.computerRepo.save(computer);
  }

  async remove(id: number): Promise<string> {
    await this.findOne(id);
    await this.computerRepo.delete(id);
    return `${id}번 컴퓨터가 삭제되었습니다.`;
  }
}
