import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Member } from "./entities/Member";
import { Payment } from "./entities/Payment";
import { Subscription } from "./entities/Subscription";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [Member, Payment, Subscription],
  migrations: [],
  subscribers: [],
});

export const initializeDB = async () => {
  try {
    await AppDataSource.initialize()
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};