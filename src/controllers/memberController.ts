import type { Request, Response } from "express";
import type { CreateMemberRequest } from "../models/member.js";
import { MemberService } from "../services/memberService.js";

export class MemberController {
  private memberService: MemberService;

  constructor() {
    this.memberService = new MemberService();
  }
  async updateMember(req: Request, res: Response): Promise<void> {
    try {
      const id: number = req.body.id;
      const memberData: CreateMemberRequest = req.body.memberData;
      const updatedMember = await this.memberService.updateMember(id, memberData);
      res.status(200).json({
        status: "success",
        data: updatedMember,
        message: "Member updated successfully",
      });
    } catch (error) {
      console.error("Error updating member:", error);
      res.status(400).json({
        error:
          error instanceof Error ? error.message : "An error occurred while updating the member",
      });
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
}
