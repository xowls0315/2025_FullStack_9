import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Animal } from "./Animal";

@Entity("zookeeper", { schema: "zoo" })
export class Zookeeper {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 80 })
  name: string;

  @Column("int", { name: "age" })
  age: number;

  @Column("enum", {
    name: "position",
    enum: ["INTERN", "STAFF", "LEAD", "MANAGER"],
  })
  position: "INTERN" | "STAFF" | "LEAD" | "MANAGER";

  @OneToMany(() => Animal, (animal) => animal.zookeeper)
  animals: Animal[];
}
