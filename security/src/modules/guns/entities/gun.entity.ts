import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('guns', { schema: 'armory' })
export class Guns {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;
}
