import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Area } from "./Area";

@Index("areas_id", ["areasId"], {})
@Entity("foodtruck", { schema: "zoo" })
export class Foodtruck {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "owner", length: 255 })
  owner: string;

  @Column("varchar", { name: "main", length: 255 })
  main: string;

  @Column("varchar", { name: "subs", length: 255 })
  subs: string;

  @Column("int", { name: "areas_id", nullable: true })
  areasId: number | null;

  @ManyToOne(() => Area, (area) => area.foodtrucks, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "areas_id", referencedColumnName: "id" }])
  areas: Area;
}
