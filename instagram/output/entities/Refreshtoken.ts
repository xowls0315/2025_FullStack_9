import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Index("userId", ["userId"], {})
@Entity("refreshtoken", { schema: "instagram" })
export class Refreshtoken {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "hashtoken", length: 255 })
  hashtoken: string;

  @Column("tinyint", { name: "isRevoked", width: 1, default: () => "'0'" })
  isRevoked: boolean;

  @Column("int", { name: "userId", nullable: true })
  userId: number | null;

  @ManyToOne(() => Users, (users) => users.refreshtokens, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
  user: Users;
}
