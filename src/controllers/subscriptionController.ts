import { Request, Response } from "express";
import { AppDataSource } from "../data-src";
import { Subscriptions } from "../entities/Subscription";
import { Member } from "../entities/Member";

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { memberId, typeSport, prixMensuel, dateDébut, durationMonths } = req.body;

    // Validate required fields
    if (!memberId || !typeSport || !prixMensuel || !dateDébut || !durationMonths) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate date format
    const startDate = new Date(dateDébut);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ message: "Invalid start date format" });
    }

    const memberRepository = AppDataSource.getRepository(Member);
    const member = await memberRepository.findOneBy({ id: memberId });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const subscriptionRepository = AppDataSource.getRepository(Subscriptions);
    const subscription = new Subscriptions();

    // Calculate end date
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);

    // Assign properties (using French names to match entity)
    subscription.member = member;
    subscription.typeSport = typeSport;
    subscription.prixMensuel = prixMensuel;
    subscription.dateDébut = startDate;
    subscription.dateFin = endDate;
    subscription.estActif = true;

    const result = await subscriptionRepository.save(subscription);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: "Error creating subscription"
    });
  }
};

export const renewSubscription = async (req: Request, res: Response) => {
  try {
    const { subscriptionId, durationMonths } = req.body;

    if (!subscriptionId || !durationMonths) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const subscriptionRepository = AppDataSource.getRepository(Subscriptions);
    const subscription = await subscriptionRepository.findOneBy({ id: subscriptionId });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Extend subscription
    const newEndDate = new Date(subscription.dateFin);
    newEndDate.setMonth(newEndDate.getMonth() + durationMonths);

    subscription.dateFin = newEndDate;
    subscription.estActif = true;

    const result = await subscriptionRepository.save(subscription);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: "Error renewing subscription"
    });
  }
};
// Similar to your deleteMember function
export const deleteSubscription = async (req: Request, res: Response) => {
  try {
    const subscriptionId = parseInt(req.params.id);
    const subscriptionRepository = AppDataSource.getRepository(Subscriptions);

    const subscription = await subscriptionRepository.findOne({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    await subscriptionRepository.remove(subscription);

    return res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (error) {
    res.status(404);
  }
};