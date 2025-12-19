import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Index("token", ["token"], { unique: true })
@Index("userId", ["userId"], {})
@Entity("refreshtokens", { schema: "armory" })
export class Refreshtokens {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("varchar", { name: "token", unique: true, length: 255 })
  token: string;

  @Column("int", { name: "userId", nullable: true })
  userId: number | null;

  @Column("datetime", { name: "expiresAt" })
  expiresAt: Date;

  @Column("datetime", { name: "revokedAt", nullable: true })
  revokedAt: Date | null;

  @ManyToOne(() => Users, (users) => users.refreshtokens, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
  user: Users;
}
