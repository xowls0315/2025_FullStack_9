import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Refreshtokens } from "./Refreshtokens";

@Index("email", ["email"], { unique: true })
@Entity("users", { schema: "armory" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @OneToMany(() => Refreshtokens, (refreshtokens) => refreshtokens.user)
  refreshtokens: Refreshtokens[];
}
