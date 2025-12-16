import { Zookeeper } from 'src/zookeeper/entities/zookeeper.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity('animal')
export class Animal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string; // 동물 이름

  @Column({ type: 'varchar', length: 100 })
  systematics: string; // 분류(예: 포유류/파충류 등)

  @Column({ type: 'int', default: 0 })
  count: number; // 마릿수

  @ManyToOne(() => Zookeeper, (zookeeper) => zookeeper.animals, {
    nullable: false,
  })
  @JoinColumn({ name: 'zookeeperId' })
  zookeeper: Zookeeper;

  // ⭐ FK 컬럼을 응답에 보이게 하는 필드(읽기 전용)
  @RelationId((animal: Animal) => animal.zookeeper)
  zookeeperId: number;
}
