import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Refreshtoken } from "./Refreshtoken";

@Index("email", ["email"], { unique: true })
@Index("nickname", ["nickname"], { unique: true })
@Entity("users", { schema: "instagram" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("varchar", { name: "nickname", unique: true, length: 255 })
  nickname: string;

  @OneToMany(() => Refreshtoken, (refreshtoken) => refreshtoken.user)
  refreshtokens: Refreshtoken[];
}
