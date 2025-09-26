import { Router } from "express";
import type { AnalyticsController } from "../controllers/AnalyticsController.js";

export function createAnalyticsRoutes(analyticsController: AnalyticsController): Router {
  const router = Router();

  // Get all library statistics in one call
  router.get("/analytics/stats", (req, res) => analyticsController.getLibraryStats(req, res));

  // Individual analytics endpoints
  router.get("/analytics/books/total", (req, res) => analyticsController.getTotalBooks(req, res));
  router.get("/analytics/members/total", (req, res) =>
    analyticsController.getTotalMembers(req, res)
  );
  router.get("/analytics/books/borrowed", (req, res) =>
    analyticsController.getBorrowedBooksCount(req, res)
  );
  router.get("/analytics/books/available", (req, res) =>
    analyticsController.getAvailableBooksCount(req, res)
  );

  return router;
}
