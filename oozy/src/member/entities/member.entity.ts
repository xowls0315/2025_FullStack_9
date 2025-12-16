import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number; // 내부 식별자 (메모리 CRUD용)

  @Column()
  name: string; // 멤버 이름

  @Column()
  position: string; // 멤버 포지션
}
