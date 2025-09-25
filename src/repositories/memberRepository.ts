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

  updateMember(id: number, updatedData: CreateMemberRequest): Promise<Member> {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE members set Fname=?,Sname=?,email=?,phone=?,address=?,city=?,postcode=? where id=?;`;
      this.db.run(
        sql,
        [
          updatedData.Fname,
          updatedData.Sname,
          updatedData.email,
          updatedData.phone,
          updatedData.address,
          updatedData.city,
          updatedData.postcode,
          id,
        ],
        (err: Error | null) => {
          if (err) return reject(err);

          // After update, fetch the updated member
          this.db.get(
            "SELECT * FROM members WHERE id = ?",
            [id],
            (err: unknown, row: Member | undefined) => {
              if (err) return reject(err);
              if (!row) return reject(new Error("Member not found after update"));
              resolve(row);
            }
          );
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
}
