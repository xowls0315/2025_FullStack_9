import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tier } from './entities/tier.entity';

@Injectable()
export class TierService implements OnModuleInit {
  constructor(
    @InjectRepository(Tier)
    private readonly tierRepo: Repository<Tier>,
  ) {}

  // ⭐ 서버 시작 시 자동 실행
  async onModuleInit() {
    const defaultTiers: Array<Tier['name']> = ['BRONZE', 'SILVER', 'GOLD'];

    for (const name of defaultTiers) {
      const exists = await this.tierRepo.findOne({
        where: { name },
      });

      if (!exists) {
        await this.tierRepo.save(this.tierRepo.create({ name }));
      }
    }

    console.log('✅ Tier 기본 데이터 확인 완료');
  }

  // 일반 CRUD
  async findAll(): Promise<Tier[]> {
    return this.tierRepo.find();
  }
}
