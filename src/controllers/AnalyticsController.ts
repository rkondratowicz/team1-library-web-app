import type { Request, Response } from "express";
import { AnalyticsService } from "../services/AnalyticsService.js";

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  async getLibraryStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.analyticsService.getLibraryStats();
      res.json(stats);
    } catch (error) {
      console.error("Error in getLibraryStats:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to fetch library statistics",
      });
    }
  }

  async getTotalBooks(req: Request, res: Response): Promise<void> {
    try {
      const count = await this.analyticsService.getTotalBooks();
      res.json({ totalBooks: count });
    } catch (error) {
      console.error("Error in getTotalBooks:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to fetch total books count",
      });
    }
  }

  async getTotalMembers(req: Request, res: Response): Promise<void> {
    try {
      const count = await this.analyticsService.getTotalMembers();
      res.json({ totalMembers: count });
    } catch (error) {
      console.error("Error in getTotalMembers:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to fetch total members count",
      });
    }
  }

  async getBorrowedBooksCount(req: Request, res: Response): Promise<void> {
    try {
      const count = await this.analyticsService.getBorrowedBooksCount();
      res.json({ borrowedBooks: count });
    } catch (error) {
      console.error("Error in getBorrowedBooksCount:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to fetch borrowed books count",
      });
    }
  }

  async getAvailableBooksCount(req: Request, res: Response): Promise<void> {
    try {
      const count = await this.analyticsService.getAvailableBooksCount();
      res.json({ availableBooks: count });
    } catch (error) {
      console.error("Error in getAvailableBooksCount:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to fetch available books count",
      });
    }
  }
}
