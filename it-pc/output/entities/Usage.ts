import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Computers } from "./Computers";
import { Guests } from "./Guests";

@Index("fk_usage_guest", ["guestId"], {})
@Index("uq_usage", ["computerId", "guestId"], { unique: true })
@Entity("usage", { schema: "it-pc" })
export class Usage {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "computer_id" })
  computerId: number;

  @Column("int", { name: "guest_id" })
  guestId: number;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @ManyToOne(() => Computers, (computers) => computers.usages, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "computer_id", referencedColumnName: "id" }])
  computer: Computers;

  @ManyToOne(() => Guests, (guests) => guests.usages, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "guest_id", referencedColumnName: "id" }])
  guest: Guests;
}
