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

  // Get all available genres
  getAllGenres(): Promise<Genre[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT GenreID, Genre FROM Genre ORDER BY Genre ASC",
        (err: unknown, rows: Genre[]) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  // Create book with genres
  createWithGenres(book: Book, genreIds: number[]): Promise<Book> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run("BEGIN TRANSACTION");

        // First insert the book
        this.db.run(
          `INSERT INTO books (ISBN, Author, Title, PublicationYear, Description)
           VALUES (?, ?, ?, ?, ?)`,
          [book.ISBN, book.Author, book.Title, book.PublicationYear, book.Description],
          (err: unknown) => {
            if (err) {
              this.db.run("ROLLBACK");
              return reject(err);
            }

            // Then insert the genre associations
            if (genreIds.length === 0) {
              this.db.run("COMMIT");
              return resolve(book);
            }

            let completed = 0;
            let hasError = false;

            for (const genreId of genreIds) {
              this.db.run(
                "INSERT INTO BookGenre (ISBN, GenreID) VALUES (?, ?)",
                [book.ISBN, genreId],
                (genreErr: unknown) => {
                  if (genreErr && !hasError) {
                    hasError = true;
                    this.db.run("ROLLBACK");
                    return reject(genreErr);
                  }

                  completed++;
                  if (completed === genreIds.length && !hasError) {
                    this.db.run("COMMIT");
                    resolve(book);
                  }
                }
              );
            }
          }
        );
      });
    });
  }

  // Update book with genres
  updateWithGenres(book: Book, genreIds: number[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run("BEGIN TRANSACTION");

        // First update the book
        this.db.run(
          `UPDATE Books SET Title = ?, Author = ?, PublicationYear = ?, Description = ? WHERE ISBN = ?`,
          [book.Title, book.Author, book.PublicationYear, book.Description, book.ISBN],
          (err: unknown) => {
            if (err) {
              this.db.run("ROLLBACK");
              return reject(err);
            }

            // Delete existing genre associations
            this.db.run(
              "DELETE FROM BookGenre WHERE ISBN = ?",
              [book.ISBN],
              (deleteErr: unknown) => {
                if (deleteErr) {
                  this.db.run("ROLLBACK");
                  return reject(deleteErr);
                }

                // Insert new genre associations
                if (genreIds.length === 0) {
                  this.db.run("COMMIT");
                  return resolve();
                }

                let completed = 0;
                let hasError = false;

                for (const genreId of genreIds) {
                  this.db.run(
                    "INSERT INTO BookGenre (ISBN, GenreID) VALUES (?, ?)",
                    [book.ISBN, genreId],
                    (genreErr: unknown) => {
                      if (genreErr && !hasError) {
                        hasError = true;
                        this.db.run("ROLLBACK");
                        return reject(genreErr);
                      }

                      completed++;
                      if (completed === genreIds.length && !hasError) {
                        this.db.run("COMMIT");
                        resolve();
                      }
                    }
                  );
                }
              }
            );
          }
        );
      });
    });
  }

  // Delete book with cleanup
  deleteWithCleanup(isbn: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run("BEGIN TRANSACTION");

        // First delete genre associations
        this.db.run(
          "DELETE FROM BookGenre WHERE ISBN = ?",
          [isbn],
          (genreErr: unknown) => {
            if (genreErr) {
              this.db.run("ROLLBACK");
              return reject(genreErr);
            }

            // Then delete the book
            this.db.run(
              "DELETE FROM Books WHERE ISBN = ?",
              [isbn],
              (bookErr: unknown) => {
                if (bookErr) {
                  this.db.run("ROLLBACK");
                  return reject(bookErr);
                }

                // Clean up orphaned genres (genres not associated with any books)
                this.db.run(
                  `DELETE FROM Genre 
                   WHERE GenreID NOT IN (
                     SELECT DISTINCT GenreID FROM BookGenre
                   )
                   AND GenreID NOT IN (
                     SELECT GenreID FROM Genre 
                     WHERE Genre IN (
                       'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 
                       'Mystery', 'Thriller', 'Romance', 'Horror', 'Biography', 
                       'History', 'Philosophy', 'Science', 'Technology', 
                       'Self-Help', 'Business', 'Health & Fitness'
                     )
                   )`,
                  (cleanupErr: unknown) => {
                    if (cleanupErr) {
                      console.warn("Warning: Could not clean up orphaned genres:", cleanupErr);
                    }
                    
                    this.db.run("COMMIT");
                    resolve();
                  }
                );
              }
            );
          }
        );
      });
    });
  }

  // Find or create genre
  findOrCreateGenre(genreName: string): Promise<number> {
    return new Promise((resolve, reject) => {
      // First try to find existing genre
      this.db.get(
        "SELECT GenreID FROM Genre WHERE Genre = ? COLLATE NOCASE",
        [genreName.trim()],
        (err: unknown, row: { GenreID: number } | undefined) => {
          if (err) return reject(err);
          
          if (row) {
            resolve(row.GenreID);
          } else {
            // Create new genre
            this.db.run(
              "INSERT INTO Genre (Genre) VALUES (?)",
              [genreName.trim()],
              function(this: sqlite3.RunResult, insertErr: unknown) {
                if (insertErr) return reject(insertErr);
                resolve(this.lastID as number);
              }
            );
          }
        }
      );
    });
  }
}

export interface Genre {
  GenreID: number;
  Genre: string;
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
