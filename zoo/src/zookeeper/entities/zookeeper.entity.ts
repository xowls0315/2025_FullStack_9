import { Animal } from 'src/animal/entities/animal.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum ZookeeperPosition {
  INTERN = 'INTERN',
  STAFF = 'STAFF',
  LEAD = 'LEAD',
  MANAGER = 'MANAGER',
}

@Entity('zookeeper')
export class Zookeeper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 80 })
  name: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'enum', enum: ZookeeperPosition })
  position: ZookeeperPosition;

  @OneToMany(() => Animal, (animal) => animal.zookeeper)
  animals: Animal[];
}
