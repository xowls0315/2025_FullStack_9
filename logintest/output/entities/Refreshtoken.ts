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
@Entity("refreshtoken", { schema: "token" })
export class Refreshtoken {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "hashedToken", length: 255 })
  hashedToken: string;

  @Column("tinyint", { name: "isRevoked", width: 1, default: () => "'0'" })
  isRevoked: boolean;

  @Column("datetime", { name: "expireAt" })
  expireAt: Date;

  @Column("int", { name: "userId" })
  userId: number;

  @ManyToOne(() => Users, (users) => users.refreshtokens, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
  user: Users;
}
