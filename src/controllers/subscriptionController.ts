import { Request, Response } from "express";
import { AppDataSource } from "../data-src";
import { Subscription } from "../entities/Subscription";
import { Member } from "../entities/Member";

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { memberId, sportType, monthlyPrice, startDate, durationMonths } = req.body;
    
    const memberRepository = AppDataSource.getRepository(Member);
    const member = await memberRepository.findOneBy({ id: memberId });
    
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const subscription = new Subscription();
    
    // Calculate end date
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);
    
    subscription.member = member;
    subscription.sportType = sportType;
    subscription.monthlyPrice = monthlyPrice;
    subscription.startDate = new Date(startDate);
    subscription.endDate = endDate;
    
    const result = await subscriptionRepository.save(subscription);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: "Error creating subscription", error });
  }
};

export const renewSubscription = async (req: Request, res: Response) => {
  try {
    const { subscriptionId, durationMonths } = req.body;
    
    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const subscription = await subscriptionRepository.findOneBy({ id: subscriptionId });
    
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    
    // Extend subscription
    const newEndDate = new Date(subscription.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + durationMonths);
    
    subscription.endDate = newEndDate;
    subscription.isActive = true;
    
    const result = await subscriptionRepository.save(subscription);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: "Error renewing subscription", error });
  }
};