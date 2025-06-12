import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-src";
import { Member } from "../entities/Member";
import { Subscription } from "../entities/Subscription";
import { Payment } from "../entities/Payment";
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
    let currentSub = member.subscriptions.find(sub => sub.isActive);

    if (!currentSub) {
      currentSub = new Subscription();
      currentSub.member = member;
      currentSub.sportType = "Default"; // or use req.body.sportType
      currentSub.monthlyPrice = amount;
      currentSub.startDate = new Date();
      currentSub.endDate = new Date();
      currentSub.endDate.setMonth(currentSub.startDate.getMonth() + 1);
      currentSub.isActive = true;
      await AppDataSource.getRepository(Subscription).save(currentSub);
    } else {
      currentSub.endDate.setMonth(currentSub.endDate.getMonth() + 1);
      currentSub.isActive = true;
      await AppDataSource.getRepository(Subscription).save(currentSub);
    }
    const paymentRepository = AppDataSource.getRepository(Payment);
    const payment = paymentRepository.create({
      member,
      subscription: currentSub,
      amount,
      paymentMethod,
    });

    const savedPayment = await paymentRepository.save(payment);
    return res.status(201).json(savedPayment);
  } catch (error) {
    next(error);
  }
};
