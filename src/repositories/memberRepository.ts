import sqlite3 from "sqlite3";
import { DATABASE_PATH } from "../config/database.js";
import type { CopyIDRow, MemberRental, RentalIDRow, RentalWithCopyIDRow } from "../models/Copy.js";

import type { CreateMemberRequest, Member } from "../models/member.js";

export class MemberRepository {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(DATABASE_PATH);
  }

  findAll(): Promise<Member[]> {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM members", (err: unknown, rows: Member[]) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  findById(id: number): Promise<Member | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM members WHERE id = ?",
        [id],
        (err: unknown, row: Member | undefined) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }

  findByName(name: string): Promise<Member[]> {
    return new Promise((resolve, reject) => {
      const searchTerm = `%${name}%`;
      this.db.all(
        "SELECT * FROM members WHERE Fname LIKE ? OR Sname LIKE ? OR (Fname || ' ' || Sname) LIKE ?",
        [searchTerm, searchTerm, searchTerm],
        (err: unknown, rows: Member[]) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  findByEmail(email: string): Promise<Member | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM members WHERE email = ?",
        [email],
        (err: unknown, row: Member | undefined) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }

  rentCopy(memberID: number, copyID: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO rentals (memberID, copyID) VALUES (?, ?)`;
      this.db.run(sql, [memberID, copyID], (err: Error | null) => {
        if (err) return reject(err);
        
        // Update copy availability to 0 (not available)
        this.db.run(
          `UPDATE copy SET Available = 0 WHERE copyID = ?`,
          [copyID],
          (err: Error | null) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });
    });
  }

  // Legacy method - kept for backward compatibility during transition
  rentBook(memberID: number, bookISBN: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Find first available copy of the book
      const findCopySql = `SELECT copyID FROM copy WHERE bookISBN = ? AND Available = 1 LIMIT 1`;
      this.db.get(findCopySql, [bookISBN], (err: unknown, row: CopyIDRow | undefined) => {
        if (err) return reject(err);
        if (!row) return reject(new Error("No available copies for this book"));

        // Rent the found copy
        this.rentCopy(memberID, row.copyID)
          .then(() => resolve())
          .catch((error) => reject(error));
      });
    });
  }

  getMemberRentals(memberID: number): Promise<MemberRental[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.*, c.copyID, b.Title, b.Author, b.ISBN
        FROM rentals r
        JOIN copy c ON r.copyID = c.copyID
        JOIN books b ON c.bookISBN = b.ISBN
        WHERE r.memberID = ? AND (r.returned IS NULL OR r.returned = 0)
      `;

      this.db.all(sql, [memberID], (err: unknown, rows: MemberRental[]) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  returnCopy(memberID: number, copyID: number): Promise<void> {
    return new Promise((resolve, reject) => {
      // First, check if there's an active rental for this copy and get the book ISBN
      const checkSql = `
        SELECT r.rentalID, c.bookISBN 
        FROM rentals r

      this.db.get(checkSql, [memberID, copyID], (err: unknown, row: { rentalID: number; bookISBN: string } | undefined) => {
        if (err) return reject(err);
        if (!row) return reject(new Error("No active rental found for this copy"));

        // Update the rental as returned
        const updateRentalSql = `
          UPDATE rentals 
          SET returned = 1, returnedDate = CURRENT_TIMESTAMP 
          WHERE rentalID = ?
        `;

        this.db.run(updateRentalSql, [row.rentalID], (err: Error | null) => {
          if (err) return reject(err);

          // Mark copy as available again
          const updateCopySql = `UPDATE copy SET Available = 1 WHERE copyID = ?`;
          this.db.run(updateCopySql, [copyID], (err: Error | null) => {
            if (err) return reject(err);

            // Increase book availability
            const updateBookSql = `UPDATE books SET available = available + 1 WHERE ISBN = ?`;
            this.db.run(updateBookSql, [row.bookISBN], (err: Error | null) => {
              if (err) return reject(err);

              // Increase book availability
              const updateBookSql = `UPDATE books SET available = available + 1 WHERE ISBN = ?`;
              this.db.run(updateBookSql, [row.bookISBN], (err: Error | null) => {
                if (err) return reject(err);
                resolve();
              });
            });
          });
        });
      });
    });
  }

  // Legacy method - kept for backward compatibility during transition
  returnBook(memberID: number, bookISBN: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Find the rented copy for this book and member
      const findRentalSql = `
        SELECT r.rentalID, r.copyID FROM rentals r
        JOIN copy c ON r.copyID = c.copyID
        WHERE r.memberID = ? AND c.bookISBN = ? AND (r.returned IS NULL OR r.returned = 0)
        LIMIT 1
      `;

      this.db.get(
        findRentalSql,
        [memberID, bookISBN],
        (err: unknown, row: RentalWithCopyIDRow | undefined) => {
          if (err) return reject(err);
          if (!row) return reject(new Error("No active rental found for this book"));

          // Return the specific copy
          this.returnCopy(memberID, row.copyID)
            .then(() => resolve())
            .catch((error) => reject(error));
        }
      );
    });
  }

  // Legacy method - kept for backward compatibility during transition
  returnBook(memberID: number, bookISBN: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Find an active rental for this member and book
      const findRentalSql = `
        SELECT r.copyID FROM rentals r
        JOIN copy c ON r.copyID = c.copyID
        WHERE r.memberID = ? AND c.bookISBN = ? AND (r.returned IS NULL OR r.returned = 0)
        LIMIT 1
      `;

      this.db.get(
        findRentalSql,
        [memberID, bookISBN],
        (err: unknown, row: CopyIDRow | undefined) => {
          if (err) return reject(err);
          if (!row) return reject(new Error("No active rental found for this book"));

          // Return the found copy
          this.returnCopy(memberID, row.copyID)
            .then(() => resolve())
            .catch((error) => reject(error));
        }
      );
    });
  }

  create(member: CreateMemberRequest): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO members (Fname, Sname, email, phone, address, city, postcode)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      this.db.run(
        sql,
        [
          member.Fname,
          member.Sname,
          member.email,
          member.phone,
          member.address,
          member.city,
          member.postcode,
        ],
        function (this: sqlite3.RunResult, err: Error | null) {
          if (err) return reject(err);
          resolve(this.lastID as number);
        }
      );
    });
  }

  search(query: string): Promise<Member[]> {
    return new Promise((resolve, reject) => {
      // Check if query is a number (searching by ID)
      const isNumeric = /^\d+$/.test(query);

      if (isNumeric) {
        // Search by ID
        this.findById(parseInt(query, 10))
          .then((member) => resolve(member ? [member] : []))
          .catch(reject);
      } else {
        // Search by name
        this.findByName(query).then(resolve).catch(reject);
      }
    });
  }

  update(id: number, member: CreateMemberRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE members SET 
         Fname = ?, Sname = ?, email = ?, phone = ?, 
         address = ?, city = ?, postcode = ? 
         WHERE id = ?`,
        [
          member.Fname,
          member.Sname,
          member.email,
          member.phone,
          member.address,
          member.city,
          member.postcode,
          id,
        ],
        (err: unknown) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }

  delete(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM members WHERE id = ?", [id], (err: unknown) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

// Interface for member rental data returned from getMemberRentals query
export interface MemberRentalData {
  rentalID: number;
  memberID: number;
  bookISBN: string;
  returned: number;
  RentalDate: string;
  returnedDate?: string;
  Title: string;
  Author: string;
  ISBN: string;
}

// Interface for rental lookup row in returnBook method
export interface RentalLookupRow {
  rentalID: number;
}

// Interface for rental with book ISBN used in returnCopy method
interface RentalWithBookISBN {
  rentalID: number;
  bookISBN: string;
}
