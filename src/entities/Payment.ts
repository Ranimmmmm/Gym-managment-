// entities/Payment.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Member } from "./Member";
import { Subscription } from "./Subscription";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("float")
  amount!: number;

  @Column()
  paymentMethod!: string;

  @CreateDateColumn()
  paidAt!: Date;

  @ManyToOne(() => Member, (member) => member.payments, { eager: true })
  member!: Member;

  @ManyToOne(() => Subscription, (sub) => sub.payments, { eager: true })
  subscription!: Subscription;
}
