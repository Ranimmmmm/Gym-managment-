import express from "express";
import {
  createMember,
  getMembers,
  updateMember,
  getMembersWithSubscriptions,
  getUnpaidMembers,
  deleteMember
} from "../controllers/memberController";

const router = express.Router();


router.get("/all", getMembers as express.RequestHandler);
router.get("/with-subscriptions", getMembersWithSubscriptions as express.RequestHandler);
router.post("/", createMember as express.RequestHandler);
router.put("/:id", updateMember as express.RequestHandler);
router.get("/unpaid-members", getUnpaidMembers);
router.delete("/:id", deleteMember as express.RequestHandler);
export default router;