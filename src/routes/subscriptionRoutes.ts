import express from "express";
import {
 createSubscription,
 renewSubscription
} from "../controllers/subscriptionController"

const router = express.Router();

router.post("/:id", createSubscription as express.RequestHandler);
router.put("/:id", renewSubscription as express.RequestHandler);

export default router;