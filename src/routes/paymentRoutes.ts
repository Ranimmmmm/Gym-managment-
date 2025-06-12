import express from "express";
import { recordPayment } from "../controllers/paymentController";

const router = express.Router();

router.post("/", recordPayment as express.RequestHandler);


export default router;