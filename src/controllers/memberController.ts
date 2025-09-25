import type { Request, Response } from "express";
import type { CreateMemberRequest } from "../models/member.js";
import { BookService } from "../services/BookService.js";
import { MemberService } from "../services/memberService.js";

export class MemberController {
  private memberService: MemberService;
  private bookService: BookService;

  constructor() {
    this.memberService = new MemberService();
    this.bookService = new BookService();
  }

  async rentBook(req: Request, res: Response): Promise<void> {
    try {
      console.log("Rent book request received");
      console.log("Member ID:", req.params.id, "Book Title:", req.params.bookTitle);

      const memberId = parseInt(req.params.id, 10);
      const bookTitle = req.params.bookTitle;
      if (Number.isNaN(memberId)) {
        res.status(400).json({ error: "Invalid member ID" });
        return;
      }

      // First check if the book exists
      const book = await this.bookService.getBookByTitle(bookTitle);
      if (book === undefined) {
        console.log("Book not found:", bookTitle);
        res.status(404).json({ error: `Book with title '${bookTitle}' not found` });
        return;
      }

      const available = await this.bookService.bookAvailable(bookTitle);
      console.log("Book availability check:", available, "for book:", bookTitle);

      if (!available) {
        res.status(400).json({ error: "Book is not available for rent" });
        return;
      }

      const bookISBN: string = book.ISBN;
      const result = await this.memberService.rentBook(memberId, bookISBN);
      if (result.success) {
        res.status(200).json({ success: true, message: result.message });
        return;
      } else {
        res.status(400).json({ error: result.message });
        return;
      }
    } catch (err: unknown) {
      console.error("Error renting book:", err);
    }
  }

  // GET /api/members/search?q=query
  async searchMembers(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;

      if (!query) {
        res.status(400).json({
          error: "Search query parameter 'q' is required",
        });
        return;
      }

      const members = await this.memberService.searchMembers(query);

      res.status(200).json({
        success: true,
        data: members,
        count: members.length,
        message: members.length > 0 ? `Found ${members.length} member(s)` : "No members found",
      });
    } catch (error) {
      console.error("Error searching members:", error);
      res.status(400).json({
        error: error instanceof Error ? error.message : "An error occurred while searching members",
      });
    }
  }

  // POST /api/members
  async addMember(req: Request, res: Response): Promise<void> {
    try {
      const memberData: CreateMemberRequest = req.body;

      const newMember = await this.memberService.createMember(memberData);

      res.status(201).json({
        success: true,
        data: newMember,
        message: "Member created successfully",
      });
    } catch (error) {
      console.error("Error creating member:", error);

      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes("email already exists")) {
          res.status(409).json({ error: error.message });
          return;
        }
        if (error.message.includes("required") || error.message.includes("Invalid")) {
          res.status(400).json({ error: error.message });
          return;
        }
      }

      res.status(500).json({
        error: "An error occurred while creating the member",
      });
    }
  }

  // GET /api/members (optional - get all members)
  async getAllMembers(_req: Request, res: Response): Promise<void> {
    try {
      const members = await this.memberService.getAllMembers();

      res.status(200).json({
        success: true,
        data: members,
        count: members.length,
      });
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({
        error: "An error occurred while fetching members",
      });
    }
  }

  // GET /api/members/:id (optional - get member by ID)
  async getMemberById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (Number.isNaN(id)) {
        res.status(400).json({ error: "Invalid member ID" });
        return;
      }

      const member = await this.memberService.getMemberById(id);

      if (!member) {
        res.status(404).json({ error: "Member not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: member,
      });
    } catch (error) {
      console.error("Error fetching member:", error);
      res.status(500).json({
        error: "An error occurred while fetching the member",
      });
    }
  }

  // PUT /api/members/:id - update member
  async updateMember(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (Number.isNaN(id)) {
        res.status(400).json({ error: "Invalid member ID" });
        return;
      }

      const memberData: CreateMemberRequest = req.body;
      const updatedMember = await this.memberService.updateMember(id, memberData);

      res.status(200).json({
        success: true,
        data: updatedMember,
        message: "Member updated successfully",
      });
    } catch (error) {
      console.error("Error updating member:", error);

      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes("email already exists")) {
          res.status(409).json({ error: error.message });
          return;
        }
        if (error.message.includes("required") || error.message.includes("Invalid")) {
          res.status(400).json({ error: error.message });
          return;
        }
      }

      res.status(500).json({
        error: "An error occurred while updating the member",
      });
    }
  }

  // DELETE /api/members/:id - delete member
  async deleteMember(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (Number.isNaN(id)) {
        res.status(400).json({ error: "Invalid member ID" });
        return;
      }

      await this.memberService.deleteMember(id);

      res.status(200).json({
        success: true,
        message: "Member deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting member:", error);

      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(500).json({
        error: "An error occurred while deleting the member",
      });
    }
  }
}
