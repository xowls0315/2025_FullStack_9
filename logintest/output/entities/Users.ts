import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Refreshtoken } from "./Refreshtoken";

@Index("nickname", ["nickname"], { unique: true })
@Entity("users", { schema: "token" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "hashedPassword", length: 255 })
  hashedPassword: string;

  @Column("varchar", { name: "nickname", unique: true, length: 255 })
  nickname: string;

  @OneToMany(() => Refreshtoken, (refreshtoken) => refreshtoken.user)
  refreshtokens: Refreshtoken[];
}
