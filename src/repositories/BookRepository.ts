import type { Book } from "../models/Book.js";
import sqlite3 from "sqlite3";
import { DATABASE_PATH } from "../config/database.js";

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
        "SELECT * FROM books WHERE title=?",
        [title],
        (err: unknown, row: Book | undefined) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }
}
