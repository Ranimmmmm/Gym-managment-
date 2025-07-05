import express from "express";
import https from 'https';
import fs from 'fs';
import cors from "cors";
import dotenv from "dotenv";
import { initializeDB } from "../src/data-src";
//import { startSubscriptionChecker } from "./services/subscriptionService";
import memberRouter from "./routes/memberRoutes";
import paymentRouter from "./routes/paymentRoutes";
import subscriptionRouter from "./routes/subscriptionRoutes"
import dashboardRouter from "./routes/dashboradRoutes"
import { errorHandler } from "./middlewares/errorHandler";
dotenv.config();
import helmet from 'helmet';
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
  origin: process.env.FRONT_URL,
  credentials: true,
  methods: 'GET,POST,PUT,DELETE,PATCH,UPDATE',
  allowedHeaders: 'Content-Type ,Authorization',
}));
app.use(express.json());
app.use(helmet());
// Routes
app.use("/members", memberRouter);
app.use("/payments", paymentRouter);
app.use("/subscriptions", subscriptionRouter);
app.use("/dashboard", dashboardRouter);
app.use(errorHandler);
// Health check
app.get("/", (req, res) => {
  res.send("Gym Management API is running");
});

// Initialize and start server
const startServer = async () => {
  await initializeDB();
  //startSubscriptionChecker();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch(error => {
  // Only log full error details in development
  if (process.env.NODE_ENV === 'development') {
    console.error("Failed to start server:", error);
  } else {
    console.error("Failed to start server:", error instanceof Error ? error.message : "Unknown error");
  }
  process.exit(1);
});