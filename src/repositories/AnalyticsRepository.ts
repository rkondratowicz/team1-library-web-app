import sqlite3 from "sqlite3";
import { DATABASE_PATH } from "../config/database.js";

export interface LibraryStats {
  totalBooks: number;
  totalMembers: number;
  booksCurrentlyBorrowed: number;
  availableBooks: number;
}

export class AnalyticsRepository {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(DATABASE_PATH);
  }

  async getLibraryStats(): Promise<LibraryStats> {
    return new Promise((resolve, reject) => {
      // Get all stats in a single query with multiple selects
      const query = `
        SELECT 
          (SELECT COUNT(*) FROM Books) as totalBooks,
          (SELECT COUNT(*) FROM members) as totalMembers,
          (SELECT COUNT(*) FROM rentals WHERE returned IS NULL OR returned = 0) as booksCurrentlyBorrowed
      `;

      this.db.get(query, (err: unknown, row: any) => {
        if (err) {
          reject(err);
          return;
        }

        const totalBooks = row.totalBooks || 0;
        const totalMembers = row.totalMembers || 0;
        const booksCurrentlyBorrowed = row.booksCurrentlyBorrowed || 0;
        const availableBooks = totalBooks - booksCurrentlyBorrowed;

        resolve({
          totalBooks,
          totalMembers,
          booksCurrentlyBorrowed,
          availableBooks: Math.max(0, availableBooks), // Ensure it's not negative
        });
      });
    });
  }

  async getTotalBooks(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT COUNT(*) as count FROM Books", (err: unknown, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row?.count || 0);
      });
    });
  }

  async getTotalMembers(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT COUNT(*) as count FROM members", (err: unknown, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row?.count || 0);
      });
    });
  }

  async getBorrowedBooksCount(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT COUNT(*) as count FROM rentals WHERE returned IS NULL OR returned = 0",
        (err: unknown, row: any) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row?.count || 0);
        }
      );
    });
  }

  async getAvailableBooksCount(): Promise<number> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          (SELECT COUNT(*) FROM Books) - 
          (SELECT COUNT(*) FROM rentals WHERE returned IS NULL OR returned = 0) as availableCount
      `;

      this.db.get(query, (err: unknown, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(Math.max(0, row?.availableCount || 0));
      });
    });
  }
}
