import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Foodtruck } from "./Foodtruck";

@Index("name", ["name"], { unique: true })
@Entity("area", { schema: "zoo" })
export class Area {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("int", { name: "size" })
  size: number;

  @OneToMany(() => Foodtruck, (foodtruck) => foodtruck.areas)
  foodtrucks: Foodtruck[];
}
