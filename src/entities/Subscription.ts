import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Member } from "./Member";
import { Paiement } from "./Payment";

@Entity()
export class Subscriptions {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Member, (member) => member.subscriptions, { onDelete: "CASCADE" })
  member!: Member;

   @Column()
  typeSport!: string; // "Musculation", "Karaté", etc.

  @Column('decimal', { precision: 10, scale: 2 })
  prixMensuel!: number;

  @Column({ type: "date" })
  dateDébut!: Date;

  @Column({ type: "date" })
  dateFin!: Date;

  @Column({ default: true })
  estActif!: boolean;

  @OneToMany(() => Paiement, (paiement) => paiement.subscription)
  paiements!: Paiement[];
}
