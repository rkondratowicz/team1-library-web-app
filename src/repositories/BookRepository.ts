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
      this.db.all("SELECT * FROM books", (err: unknown, rows: Book[]) => {
        if (err) return reject(err);
        resolve(rows);
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
          resolve(row);
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
        (err: unknown, rows: Book[]) => {
          if (err) return reject(err);
          resolve(rows);
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
      this.db.run(
        `DELETE FROM Books WHERE ISBN = ?`,
        [isbn],
        (err: unknown) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }
}
