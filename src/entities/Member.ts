import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Subscription } from "./Subscription";
import { Payment } from "./Payment";

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  phone!: string;

  @Column({ type: "date", default: () => "CURRENT_DATE" })
  joinDate!: Date;

  @OneToMany(() => Subscription, (subscription) => subscription.member ,  { cascade: true })
  subscriptions!: Subscription[];

  @OneToMany(() => Payment, (payment) => payment.member,  { cascade: true })
  payments!: Payment[];

  // Add this method for dashboard display
  getExpiringSubscriptions(): Subscription[] {
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    
    return this.subscriptions.filter(sub => 
      sub.isActive && 
      new Date(sub.endDate) > today && 
      new Date(sub.endDate) <= sevenDaysFromNow
    );
  }
}