import { Usage } from 'src/usage/entities/usage.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ComputerSpec, ComputerStatus } from '../dto/create-computer.dto';

@Entity('computers', { schema: 'it-pc' })
export class Computers {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'enum', name: 'spec', enum: ComputerSpec })
  spec: ComputerSpec;

  @Column('int', { name: 'price' })
  price: number;

  @Column({ type: 'enum', name: 'status', enum: ComputerStatus })
  status: ComputerStatus;

  @OneToMany(() => Usage, (usage) => usage.computer)
  usages: Usage[];
}
