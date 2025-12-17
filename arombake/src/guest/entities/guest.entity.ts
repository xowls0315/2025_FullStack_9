import { Tier } from 'src/tier/entities/tier.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('fk_guest_tier', ['tierId'], {})
@Entity('guest', { schema: 'arombake' })
export class Guest {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 80 })
  name: string;

  @Column('int', { name: 'spending' })
  spending: number;

  @Column('int', { name: 'tier_id' })
  tierId: number;

  @ManyToOne(() => Tier, (tier) => tier.guests, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'tier_id', referencedColumnName: 'id' }])
  tier: Tier;
}
