import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Guest } from "./Guest";

@Index("name", ["name"], { unique: true })
@Entity("tier", { schema: "arombake" })
export class Tier {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("enum", {
    name: "name",
    unique: true,
    enum: ["BRONZE", "SILVER", "GOLD"],
  })
  name: "BRONZE" | "SILVER" | "GOLD";

  @OneToMany(() => Guest, (guest) => guest.tier)
  guests: Guest[];
}
