import sqlite3 from 'sqlite3';
import { DATABASE_PATH } from '../config/database.js';
import type { Copy, CreateCopyRequest, CopyWithBookDetails, AvailableCopySummary } from '../models/Copy.js';

export class CopyRepository {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(DATABASE_PATH);
  }

  // Find all copies for a specific book ISBN
  findByISBN(isbn: string): Promise<Copy[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT copyID, bookISBN, Available FROM copy WHERE bookISBN = ?`;
      this.db.all(sql, [isbn], (err: unknown, rows: Copy[]) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  // Find all available copies for a specific book ISBN
  findAvailableByISBN(isbn: string): Promise<Copy[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT copyID, bookISBN, Available FROM copy WHERE bookISBN = ? AND Available = 1`;
      this.db.all(sql, [isbn], (err: unknown, rows: Copy[]) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  // Find a specific copy by copyID
  findById(copyID: number): Promise<Copy | undefined> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT copyID, bookISBN, Available FROM copy WHERE copyID = ?`;
      this.db.get(sql, [copyID], (err: unknown, row: Copy | undefined) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  // Get copy with book details
  findByIdWithBookDetails(copyID: number): Promise<CopyWithBookDetails | undefined> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT c.copyID, c.bookISBN, c.Available, 
               b.Title, b.Author, b.PublicationYear, b.Description
        FROM copy c
        JOIN Books b ON c.bookISBN = b.ISBN
        WHERE c.copyID = ?
      `;
      this.db.get(sql, [copyID], (err: unknown, row: CopyWithBookDetails | undefined) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  // Get summary of all books with their copies
  getAllBooksWithCopies(): Promise<AvailableCopySummary[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT b.ISBN as bookISBN, b.Title, b.Author, b.PublicationYear, b.Description,
               COUNT(c.copyID) as totalCopies,
               COUNT(CASE WHEN c.Available = 1 THEN 1 END) as availableCopies
        FROM Books b
        LEFT JOIN copy c ON b.ISBN = c.bookISBN
        GROUP BY b.ISBN, b.Title, b.Author, b.PublicationYear, b.Description
        ORDER BY b.Title
      `;
      
      this.db.all(sql, [], async (err: unknown, rows: any[]) => {
        if (err) return reject(err);
        
        try {
          // For each book, get its individual copies
          const booksWithCopies = await Promise.all(
            rows.map(async (row) => {
              const copies = await this.findByISBN(row.bookISBN);
              return {
                bookISBN: row.bookISBN,
                Title: row.Title,
                Author: row.Author,
                PublicationYear: row.PublicationYear,
                Description: row.Description,
                totalCopies: row.totalCopies || 0,
                availableCopies: row.availableCopies || 0,
                copies: copies
              };
            })
          );
          resolve(booksWithCopies);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  // Update copy availability status
  updateAvailability(copyID: number, available: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE copy SET Available = ? WHERE copyID = ?`;
      this.db.run(sql, [available, copyID], (err: unknown) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  // Create a new copy
  create(copyData: CreateCopyRequest): Promise<Copy> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO copy (bookISBN, Available) VALUES (?, ?)`;
      const available = copyData.Available ?? 1;
      
      this.db.run(sql, [copyData.bookISBN, available], function (this: sqlite3.RunResult, err: Error | null) {
        if (err) return reject(err);
        
        const newCopy: Copy = {
          copyID: this.lastID,
          bookISBN: copyData.bookISBN,
          Available: available
        };
        resolve(newCopy);
      });
    });
  }

  // Delete a copy
  delete(copyID: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM copy WHERE copyID = ?`;
      this.db.run(sql, [copyID], (err: unknown) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  // Check if a copy is available for rental
  isAvailable(copyID: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT Available FROM copy WHERE copyID = ?`;
      this.db.get(sql, [copyID], (err: unknown, row: any) => {
        if (err) return reject(err);
        if (!row) return resolve(false);
        resolve(row.Available === 1);
      });
    });
  }

  // Get copies that are currently rented (for reporting)
  getRentedCopies(): Promise<CopyWithBookDetails[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT c.copyID, c.bookISBN, c.Available, 
               b.Title, b.Author, b.PublicationYear, b.Description
        FROM copy c
        JOIN Books b ON c.bookISBN = b.ISBN
        WHERE c.Available = 0
        ORDER BY b.Title
      `;
      this.db.all(sql, [], (err: unknown, rows: CopyWithBookDetails[]) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}