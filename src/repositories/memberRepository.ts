import sqlite3 from "sqlite3";
import { DATABASE_PATH } from "../config/database.js";
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

  rentBook(memberID: number, bookISBN: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO rentals (memberID,bookISBN)VALUES(?,?)`;
      this.db.run(sql, [memberID, bookISBN], function (this: sqlite3.RunResult, err: Error | null) {
        if (err) return reject(err);
        resolve();
      });
      this.db.run(`UPDATE books SET available=available-1 WHERE ISBN=?`, [bookISBN]);
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
