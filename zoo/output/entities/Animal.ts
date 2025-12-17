import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Zookeeper } from "./Zookeeper";

@Entity("animal", { schema: "zoo" })
export class Animal {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 100 })
  name: string;

  @Column("varchar", { name: "systematics", length: 100 })
  systematics: string;

  @Column("int", { name: "count", default: () => "'0'" })
  count: number;

  @ManyToOne(() => Zookeeper, (zookeeper) => zookeeper.animals, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "zookeeperId", referencedColumnName: "id" }])
  zookeeper: Zookeeper;
}
