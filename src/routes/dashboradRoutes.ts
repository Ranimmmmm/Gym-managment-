import express from "express";
import {
  getDashboardData,

} from "../controllers/dashboardController";

const router = express.Router();

router.get("/all", getDashboardData as express.RequestHandler);

export default router;