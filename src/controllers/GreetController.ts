import type { Request, Response } from "express";
import { greet } from "../utils/index.js";

export function greetHandler(req: Request, res: Response): void {
  const name = req.body.name;
  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }
  res.status(200).send(greet(name));
}

export function greet2Handler(req: Request, res: Response): void {
  const name = req.query.name;
  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }
  res.status(200).send(greet(String(name)));
}
