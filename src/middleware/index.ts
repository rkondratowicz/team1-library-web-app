import cors from "cors";
import type express from "express";
import morgan from "morgan";

export function setupMiddleware(app: express.Express): void {
  app.use(cors());
  app.use(morgan("dev"));
}
