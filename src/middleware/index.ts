import cors from "cors";
import morgan from "morgan";
import express from "express";

export function setupMiddleware(app: express.Express): void {
  app.use(cors());
  app.use(morgan("dev"));
}
