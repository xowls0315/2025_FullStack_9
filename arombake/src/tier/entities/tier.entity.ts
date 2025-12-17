import { Guest } from 'src/guest/entities/guest.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export type TierName = 'BRONZE' | 'SILVER' | 'GOLD';

@Entity('tier')
export class Tier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  name: TierName;

  // ✅ 1:N 관계 추가 (tier 1, guest N)
  @OneToMany(() => Guest, (guest) => guest.tier)
  guests: Guest[];
}
