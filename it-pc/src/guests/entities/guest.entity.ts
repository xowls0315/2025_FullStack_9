import { Usage } from 'src/usage/entities/usage.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('guests', { schema: 'it-pc' })
export class Guests {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 50 })
  name: string;

  @Column('varchar', { name: 'password', length: 255 })
  password: string;

  @Column('int', { name: 'age' })
  age: number;

  @OneToMany(() => Usage, (usage) => usage.guest)
  usages: Usage[];
}
