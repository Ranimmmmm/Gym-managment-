import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Member } from "./Member";
import { Payment } from "./Payment";

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Member, (member) => member.subscriptions, { onDelete: "CASCADE" })
  member!: Member;

  @Column()
  sportType!: string; // e.g., "Musculation", "Karaté"

  @Column('decimal', { precision: 10, scale: 2 })
  monthlyPrice!: number;

  @Column({ type: "date" })
  startDate!: Date;

  @Column({ type: "date" })
  endDate!: Date;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Payment, (payment) => payment.subscription)
payments!: Payment[];


}