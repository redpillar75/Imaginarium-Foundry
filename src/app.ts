import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { logger } from "./config/logger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import sourceRoutes from "./routes/sources";
import ideaRoutes from "./routes/ideas";
import productionTaskRoutes from "./routes/productionTasks";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(pinoHttp({ logger, autoLogging: process.env.NODE_ENV !== "test" }));

  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

  app.use("/api/auth", authRoutes);
  app.use("/api/sources", sourceRoutes);
  app.use("/api/ideas", ideaRoutes);
  app.use("/api/production-tasks", productionTaskRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
