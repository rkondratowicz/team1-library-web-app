import { Router } from "express";
import { greet2Handler, greetHandler } from "../controllers/GreetController.js";

export function createGreetRoutes(): Router {
  const router = Router();
  router.post("/greet", greetHandler);
  router.get("/greet2", greet2Handler);
  return router;
}
