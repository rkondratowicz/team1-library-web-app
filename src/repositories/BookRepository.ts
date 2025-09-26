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
  getRentals(): Promise<Book[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT m.id,m.fname,m.Sname, m.email , b.ISBN,b.Title, b.Author 
        FROM members as m 
        JOIN rentals as r on m.id=r.memberID 
        join books as b on r.bookISBN=b.ISBN order by r.rentalDate desc ;`,
        (err: unknown, rows: Book[]) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
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
}
