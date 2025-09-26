import sqlite3 from "sqlite3";
import { DATABASE_PATH } from "../config/database.js";
import type { Book } from "../models/Book.js";

export class BookRepository {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(DATABASE_PATH);
  }

  findAll(): Promise<Book[]> {
    return new Promise((resolve, reject) => {
      // First get all books
      this.db.all("SELECT * FROM books", (err: unknown, bookRows: Book[]) => {
        if (err) return reject(err);

        if (bookRows.length === 0) {
          resolve([]);
          return;
        }

        // Then get genres for each book
        const bookPromises = bookRows.map((book) => {
          return new Promise<Book>((bookResolve, bookReject) => {
            this.db.all(
              `SELECT g.Genre 
               FROM Genre g 
               JOIN BookGenre bg ON g.GenreID = bg.GenreID 
               WHERE bg.ISBN = ?`,
              [book.ISBN],
              (genreErr: unknown, genreRows: { Genre: string }[]) => {
                if (genreErr) return bookReject(genreErr);
                book.genres = genreRows.map((row) => row.Genre);
                bookResolve(book);
              }
            );
          });
        });

        Promise.all(bookPromises).then(resolve).catch(reject);
      });
    });
  }

  findByTitle(title: string): Promise<Book | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM books WHERE Title=?",
        [title],
        (err: unknown, row: Book | undefined) => {
          if (err) return reject(err);
          if (!row) {
            resolve(undefined);
            return;
          }

          // Get genres for this book
          this.db.all(
            `SELECT g.Genre 
             FROM Genre g 
             JOIN BookGenre bg ON g.GenreID = bg.GenreID 
             WHERE bg.ISBN = ?`,
            [row.ISBN],
            (genreErr: unknown, genreRows: { Genre: string }[]) => {
              if (genreErr) return reject(genreErr);
              row.genres = genreRows.map((genreRow) => genreRow.Genre);
              resolve(row);
            }
          );
        }
      );
    });
  }

  searchBooks(searchTerm: string): Promise<Book[]> {
    return new Promise((resolve, reject) => {
      const searchPattern = `%${searchTerm}%`;
      this.db.all(
        `SELECT * FROM books 
         WHERE Title LIKE ? 
         OR Author LIKE ? 
         OR CAST(ISBN AS TEXT) LIKE ?
         ORDER BY Title ASC`,
        [searchPattern, searchPattern, searchPattern],
        (err: unknown, bookRows: Book[]) => {
          if (err) return reject(err);

          if (bookRows.length === 0) {
            resolve([]);
            return;
          }

          // Get genres for each book
          const bookPromises = bookRows.map((book) => {
            return new Promise<Book>((bookResolve, bookReject) => {
              this.db.all(
                `SELECT g.Genre 
                 FROM Genre g 
                 JOIN BookGenre bg ON g.GenreID = bg.GenreID 
                 WHERE bg.ISBN = ?`,
                [book.ISBN],
                (genreErr: unknown, genreRows: { Genre: string }[]) => {
                  if (genreErr) return bookReject(genreErr);
                  book.genres = genreRows.map((row) => row.Genre);
                  bookResolve(book);
                }
              );
            });
          });

          Promise.all(bookPromises).then(resolve).catch(reject);
        }
      );
    });
  }

  create(book: Book): Promise<Book> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO books (ISBN, Author, Title, PublicationYear, Description)
         VALUES (?, ?, ?, ?, ?)`,
        [book.ISBN, book.Author, book.Title, book.PublicationYear, book.Description],
        (err: unknown) => {
          if (err) return reject(err);
          resolve(book);
        }
      );
    });
  }

  update(book: Book): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE Books SET Title = ?, Author = ?, PublicationYear = ?, Description = ? WHERE ISBN = ?`,
        [book.Title, book.Author, book.PublicationYear, book.Description, book.ISBN],
        (err: unknown) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }

  delete(isbn: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM Books WHERE ISBN = ?`, [isbn], (err: unknown) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  findRentalHistory(isbn: string): Promise<RentalHistoryEntry[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          r.rentalID,
          r.memberID,
          r.bookISBN,
          r.returned,
          r.RentalDate,
          r.returnedDate,
          (m.Fname || ' ' || m.Sname) as memberName,
          m.email as memberEmail
        FROM rentals r
        LEFT JOIN members m ON r.memberID = m.id
        WHERE r.bookISBN = ?
        ORDER BY r.RentalDate ASC
      `;

      console.log("Executing rental history query for ISBN:", isbn);
      console.log("SQL:", sql);

      this.db.all(sql, [isbn], (err: unknown, rows: any[]) => {
        if (err) {
          console.error("Database error in findRentalHistory:", err);
          return reject(err);
        }

        console.log("Rental history query returned", rows?.length || 0, "rows");
        console.log("Sample data:", rows?.[0]);

        const rentalHistory: RentalHistoryEntry[] = rows.map((row) => ({
          rentalID: row.rentalID,
          memberID: row.memberID,
          bookISBN: row.bookISBN,
          returned: row.returned === 1,
          rentalDate: row.RentalDate,
          returnedDate: row.returnedDate,
          memberName: row.memberName,
          memberEmail: row.memberEmail,
        }));

        resolve(rentalHistory);
      });
    });
  }

  findByISBN(isbn: string): Promise<Book | undefined> {
    return new Promise((resolve, reject) => {
      console.log("Finding book by ISBN:", isbn);

      this.db.get(
        "SELECT * FROM books WHERE ISBN = ?",
        [isbn],
        (err: unknown, row: Book | undefined) => {
          if (err) {
            console.error("Database error in findByISBN:", err);
            return reject(err);
          }
          if (!row) {
            console.log("No book found with ISBN:", isbn);
            resolve(undefined);
            return;
          }

          console.log("Found book:", row);

          // Get genres for this book
          this.db.all(
            `SELECT g.Genre 
             FROM Genre g 
             JOIN BookGenre bg ON g.GenreID = bg.GenreID 
             WHERE bg.ISBN = ?`,
            [row.ISBN],
            (genreErr: unknown, genreRows: { Genre: string }[]) => {
              if (genreErr) {
                console.error("Database error getting genres:", genreErr);
                return reject(genreErr);
              }
              console.log("Found genres for book:", genreRows);
              row.genres = genreRows.map((genreRow) => genreRow.Genre);
              resolve(row);
            }
          );
        }
      );
    });
  }
}

export interface RentalHistoryEntry {
  rentalID: number;
  memberID: number;
  bookISBN: string;
  returned: boolean;
  rentalDate: string;
  returnedDate?: string;
  memberName?: string;
  memberEmail?: string;
}
