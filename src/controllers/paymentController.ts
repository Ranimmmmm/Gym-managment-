import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-src";
import { Member } from "../entities/Member";
import { Subscriptions } from "../entities/Subscription";
import { Paiement } from "../entities/Payment";
export const recordPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { memberId, amount, paymentMethod = "Cash" } = req.body;
    const memberRepository = AppDataSource.getRepository(Member);
    const member = await memberRepository.findOne({
      where: { id: memberId },
      relations: ["subscriptions"]
    });

    if (!member) return res.status(404).json({ message: "Member not found" });

    // Get current subscription or create new
    let currentSub = member.subscriptions.find(sub => sub.estActif);

    if (!currentSub) {
      currentSub = new Subscriptions();
      currentSub.member = member;
      currentSub.typeSport = "Default"; // or use req.body.sportType
      currentSub.prixMensuel = amount;
      currentSub.dateDébut = new Date();
      currentSub.dateFin = new Date();
      currentSub.dateFin.setMonth(currentSub.dateDébut.getMonth() + 1);
      currentSub.estActif = true;
      await AppDataSource.getRepository(Subscriptions).save(currentSub);
    } else {
      currentSub.dateFin.setMonth(currentSub.dateFin.getMonth() + 1);
      currentSub.estActif = true;
      await AppDataSource.getRepository(Subscriptions).save(currentSub);
    }
    const paymentRepository = AppDataSource.getRepository(Paiement);
    const payment = paymentRepository.create({
      member: member,        // matches your entity's 'membre' property
      montant: amount // matches your entity's 'abonnement' property
  
    });

    const savedPayment = await paymentRepository.save(payment);
    return res.status(201).json(savedPayment);
  } catch (error) {
    next(error);
  }
};
