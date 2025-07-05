import { Request, Response } from "express";
import { AppDataSource } from "../data-src";
import { Member } from "../entities/Member";
import { Paiement } from "../entities/Payment";
export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const memberRepository = AppDataSource.getRepository(Member);
    const members = await memberRepository.find({
      relations: ["subscriptions", "payments"]
    });

    // Calculate dashboard metrics
    const totalMembers = members.length;
    const activeSubscriptions = members.flatMap(m => m.subscriptions).filter(s => s.estActif).length;
    const monthlyRevenue = members.flatMap(m => m.paiement)
      .filter(p => {
        const paymentDate = new Date(p.datePaiement);
        const now = new Date();
        return paymentDate.getMonth() === now.getMonth() &&
          paymentDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, payment) => sum + parseFloat(payment.montant.toString()), 0);

    // Get expiring subscriptions (within 7 days)
    const expiringSubscriptions = members.flatMap(member =>
      member.getExpiringSubscriptions().map(sub => ({
        memberId: member.id,
        memberName: `${member.prenom} ${member.nom}`,
        memberPhone: member.telephone,
        sportType: sub.typeSport,
        endDate: sub.dateFin,
        daysLeft: Math.ceil(
          (new Date(sub.dateFin).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      }))
    );

    res.json({
      totalMembers,
      activeSubscriptions,
      monthlyRevenue,
      expiringSubscriptions
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};