import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-src";
import { Member } from "../entities/Member";

export const createMember = async (req: Request, res: Response) => {
  try {
    const memberRepository = AppDataSource.getRepository(Member);
    const member = memberRepository.create(req.body);
    const result = await memberRepository.save(member);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: "Error creating member", error });
  }
};

export const getMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const memberRepository = AppDataSource.getRepository(Member);
    const members = await memberRepository.find();
    return res.json(members);
  } catch (error) {
    next(error);
  }
};

export const getMembersWithSubscriptions = async (
  req: Request,
  res: Response
) => {
  try {
    const memberRepository = AppDataSource.getRepository(Member);
    const members = await memberRepository.find({
      relations: ["subscriptions", "payments"]
    });

    const membersWithStatus = members.map(member => {
      const activeSubscriptions = member.subscriptions.filter(s => s.isActive);
      const expiringSoon = activeSubscriptions.filter(sub => {
        const endDate = new Date(sub.endDate);
        const today = new Date();
        const timeDiff = endDate.getTime() - today.getTime();
        const daysLeft = timeDiff / (1000 * 3600 * 24);
        return daysLeft <= 30;
      });

      return {
        ...member,
        subscriptionStatus: {
          total: member.subscriptions.length,
          active: activeSubscriptions.length,
          expiringSoon: expiringSoon.length
        }
      };
    });

    res.json(membersWithStatus);
  } catch (error) {
    res.status(500).json({ message: "Error fetching members" });
  }
};

export const updateMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const memberRepository = AppDataSource.getRepository(Member);
    const member = await memberRepository.findOneBy({
      id: parseInt(req.params.id)
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    memberRepository.merge(member, req.body);
    const result = await memberRepository.save(member);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

// controllers/memberController.ts
export const getUnpaidMembers = async (req: Request, res: Response) => {
  try {
    const memberRepository = AppDataSource.getRepository(Member);
    const members = await memberRepository.find({
      relations: ["subscriptions"],
    });

    const today = new Date();

    const unpaidMembers = members.filter((member) => {
      const activeSub = member.subscriptions.find(
        (sub) => sub.isActive && new Date(sub.endDate) >= today
      );
      return !activeSub;
    });

    res.json(unpaidMembers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching unpaid members", error });
  }
};

export const deleteMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const memberId = parseInt(req.params.id);
    const memberRepository = AppDataSource.getRepository(Member);

    const member = await memberRepository.findOne({
      where: { id: memberId },
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    await memberRepository.remove(member);

    return res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    next(error);
  }
};