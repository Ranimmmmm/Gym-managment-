 import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Subscriptions } from "./Subscription";
import { Paiement } from "./Payment";

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  prenom!: string;

  @Column()
  nom!: string;

  @Column({ unique: true })
  telephone!: string;
  @Column()
  adresse!: string;
   @Column({ type: "date", nullable: true })
  datedenaissence?: Date;

  @Column({ nullable: true })
  telParent?: string;
  @Column({ type: "date", default: () => "CURRENT_DATE" })
  dateInscription!: Date;

  @OneToMany(() => Subscriptions, (subscription) => subscription.member ,  { cascade: true })
  subscriptions!: Subscriptions[];

  @OneToMany(() => Paiement, (paiement) => paiement.member,  { cascade: true })
  paiement!: Paiement[];

  // Add this method for dashboard display
  getExpiringSubscriptions(): Subscriptions[] {
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    
    return this.subscriptions.filter(sub => 
      sub.estActif && 
      new Date(sub.dateFin) > today && 
      new Date(sub.dateFin) <= sevenDaysFromNow
    );
  }
} 