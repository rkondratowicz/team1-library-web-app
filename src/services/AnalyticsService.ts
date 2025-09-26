import { AnalyticsRepository, type LibraryStats } from "../repositories/AnalyticsRepository.js";

export class AnalyticsService {
  private analyticsRepository: AnalyticsRepository;

  constructor() {
    this.analyticsRepository = new AnalyticsRepository();
  }

  async getLibraryStats(): Promise<LibraryStats> {
    try {
      return await this.analyticsRepository.getLibraryStats();
    } catch (error) {
      console.error("Error fetching library stats:", error);
      // Return default values if there's an error
      return {
        totalBooks: 0,
        totalMembers: 0,
        booksCurrentlyBorrowed: 0,
        availableBooks: 0,
      };
    }
  }

  async getTotalBooks(): Promise<number> {
    try {
      return await this.analyticsRepository.getTotalBooks();
    } catch (error) {
      console.error("Error fetching total books:", error);
      return 0;
    }
  }

  async getTotalMembers(): Promise<number> {
    try {
      return await this.analyticsRepository.getTotalMembers();
    } catch (error) {
      console.error("Error fetching total members:", error);
      return 0;
    }
  }

  async getBorrowedBooksCount(): Promise<number> {
    try {
      return await this.analyticsRepository.getBorrowedBooksCount();
    } catch (error) {
      console.error("Error fetching borrowed books count:", error);
      return 0;
    }
  }

  async getAvailableBooksCount(): Promise<number> {
    try {
      return await this.analyticsRepository.getAvailableBooksCount();
    } catch (error) {
      console.error("Error fetching available books count:", error);
      return 0;
    }
  }
}
