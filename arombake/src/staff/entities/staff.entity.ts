import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('staff', { schema: 'arombake' })
export class Staff {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 80 })
  name: string;

  @Column('int', { name: 'age' })
  age: number;

  @Column('int', { name: 'hire_year' })
  hireYear: number;
}
