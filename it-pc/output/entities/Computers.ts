import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usage } from "./Usage";

@Entity("computers", { schema: "it-pc" })
export class Computers {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("enum", { name: "spec", enum: ["좋음", "보통", "나쁨"] })
  spec: "좋음" | "보통" | "나쁨";

  @Column("int", { name: "price" })
  price: number;

  @Column("enum", { name: "status", enum: ["양호", "고장", "수리중"] })
  status: "양호" | "고장" | "수리중";

  @OneToMany(() => Usage, (usage) => usage.computer)
  usages: Usage[];
}
