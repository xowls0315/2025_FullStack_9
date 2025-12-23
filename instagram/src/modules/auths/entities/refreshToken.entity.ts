import { Users } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('userId', ['userId'], {})
@Entity('refreshtoken', { schema: 'instargram' })
export class Refreshtoken {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'hashtoken', length: 255 })
  hashtoken: string;

  @Column('tinyint', { name: 'isRevoked', width: 1, default: () => "'0'" })
  isRevoked: boolean;

  @Column('datetime', { name: 'expiresAt' })
  expiresAt: Date;

  @Column('int', { name: 'userId', nullable: true })
  userId: number | null;

  @ManyToOne(() => Users, (users) => users.refreshtokens, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: Users;
}
