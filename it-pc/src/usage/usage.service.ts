import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Usage } from './entities/usage.entity';
import { CreateUsageDto } from './dto/create-usage.dto';
import { UpdateUsageDto } from './dto/update-usage.dto';
import { Computers } from 'src/computers/entities/computer.entity';
import { Guests } from 'src/guests/entities/guest.entity';

@Injectable()
export class UsageService {
  constructor(
    @InjectRepository(Usage) private readonly usageRepo: Repository<Usage>,
    @InjectRepository(Computers)
    private readonly computerRepo: Repository<Computers>,
    @InjectRepository(Guests) private readonly guestRepo: Repository<Guests>,
  ) {}

  // CREATE
  async create(dto: CreateUsageDto): Promise<Usage> {
    const computer = await this.computerRepo.findOne({
      where: { id: dto.computerId },
    });
    if (!computer) {
      throw new NotFoundException(`${dto.computerId}번 컴퓨터 없음`);
    }

    const guest = await this.guestRepo.findOne({
      where: { id: dto.guestId },
    });
    if (!guest) {
      throw new NotFoundException(`${dto.guestId}번 손님 없음`);
    }

    // UNIQUE(computerId, guestId) 중복 방지
    const exists = await this.usageRepo.findOne({
      where: { computerId: dto.computerId, guestId: dto.guestId },
    });
    if (exists) {
      throw new ConflictException('이미 사용 관계가 존재합니다.');
    }

    const usage = this.usageRepo.create({
      computerId: dto.computerId,
      guestId: dto.guestId,
      computer, // 관계도 같이 세팅(선택)
      guest, // 관계도 같이 세팅(선택)
    });

    return this.usageRepo.save(usage);
  }

  // READ ALL
  async findAll(): Promise<Usage[]> {
    return this.usageRepo.find({
      relations: { computer: true, guest: true },
    });
  }

  // READ ONE
  async findOne(id: number): Promise<Usage> {
    const usage = await this.usageRepo.findOne({
      where: { id },
      relations: { computer: true, guest: true },
    });
    if (!usage) {
      throw new NotFoundException(`${id}번 usage(이용기록) 없음`);
    }
    return usage;
  }

  // UPDATE (PATCH/PUT 공통: 안 준 값 유지)
  async update(id: number, dto: UpdateUsageDto): Promise<Usage> {
    const usage = await this.findOne(id);

    const nextComputerId = dto.computerId ?? usage.computerId;
    const nextGuestId = dto.guestId ?? usage.guestId;

    // FK 유효성 체크
    const computer = await this.computerRepo.findOne({
      where: { id: nextComputerId },
    });
    if (!computer) {
      throw new NotFoundException(`${nextComputerId}번 컴퓨터 없음`);
    }

    const guest = await this.guestRepo.findOne({
      where: { id: nextGuestId },
    });
    if (!guest) {
      throw new NotFoundException(`${nextGuestId}번 손님 없음`);
    }

    // 중복 체크(자기 자신 제외)
    const duplicated = await this.usageRepo.findOne({
      where: { computerId: nextComputerId, guestId: nextGuestId },
    });
    if (duplicated && duplicated.id !== id) {
      throw new ConflictException('이미 같은 사용 관계가 존재합니다.');
    }

    usage.computerId = nextComputerId;
    usage.guestId = nextGuestId;
    usage.computer = computer;
    usage.guest = guest;

    return this.usageRepo.save(usage);
  }

  // DELETE
  async remove(id: number): Promise<string> {
    await this.findOne(id);
    await this.usageRepo.delete(id);
    return `${id}번 usage가 삭제되었습니다.`;
  }
}
