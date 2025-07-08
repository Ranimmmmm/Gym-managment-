import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Member } from "./entities/Member";
import { Paiement } from "./entities/Payment";
import { Subscriptions } from "./entities/Subscription";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
 /* host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,  */
  synchronize: true,
  logging: false,
  //dropSchema: true,
  entities: [Member, Paiement, Subscriptions],
  migrations: [],
  subscribers: [],
});

export const initializeDB = async () => {
  try {
    await AppDataSource.initialize()
    console.log("Database connected successfully");
  } catch (error) {
    // Only log full error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error("Database connection failed", error);
    } else {
      console.error("Database connection failed:", error instanceof Error ? error.message : "Unknown error");
    }
    process.exit(1);
  }
};