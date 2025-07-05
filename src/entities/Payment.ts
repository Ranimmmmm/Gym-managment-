import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Member } from "./Member";
import { Subscriptions } from "./Subscription";

@Entity()
export class Paiement {
  @PrimaryGeneratedColumn()
  id!: number;

    @Column("float")
  montant!: number;


  @CreateDateColumn()
  datePaiement!: Date;

  @ManyToOne(() => Member, (member) => member.paiement)
  member!: Member;

  @ManyToOne(() => Subscriptions, (sub) => sub.paiements, { eager: true })
  subscription!: Subscriptions;
}
