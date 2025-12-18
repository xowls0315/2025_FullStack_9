import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('uq_users_email', ['email'], { unique: true })
@Entity('users', { schema: 'it-pc' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', unique: true, length: 255 })
  email: string;

  @Column('varchar', { name: 'password', length: 255 })
  password: string;
}
