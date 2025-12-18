import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("staffs", { schema: "it-pc" })
export class Staffs {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 50 })
  name: string;

  @Column("int", { name: "hire_year" })
  hireYear: number;
}
