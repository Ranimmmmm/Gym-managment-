import express from "express";
import {
 createSubscription,
 renewSubscription,
 deleteSubscription
} from "../controllers/subscriptionController"

const router = express.Router();

router.post("/:id", createSubscription as express.RequestHandler);
router.put("/:id", renewSubscription as express.RequestHandler);
router.delete("/:id", deleteSubscription as express.RequestHandler);

export default router;