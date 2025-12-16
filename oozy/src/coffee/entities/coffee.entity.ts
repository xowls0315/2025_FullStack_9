import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number; // 내부 식별자 (메모리 CRUD용)

  @Column({ unique: true })
  name: string; // 커피 이름

  @Column()
  price: number; // 가격

  @Column()
  shots: number; // 샷 수
}
