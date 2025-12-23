import { Refreshtoken } from 'src/modules/auths/entities/refreshToken.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('email', ['email'], { unique: true })
@Index('nickname', ['nickname'], { unique: true })
@Entity('users', { schema: 'instargram' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', unique: true, length: 255 })
  email: string;

  @Column('varchar', { name: 'password', length: 255 })
  password: string;

  @Column('varchar', { name: 'nickname', unique: true, length: 255 })
  nickname: string;

  @OneToMany(() => Refreshtoken, (refreshtoken) => refreshtoken.user)
  refreshtokens: Refreshtoken[];
}
