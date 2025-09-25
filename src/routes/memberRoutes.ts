import { Router } from "express";
import type { MemberController } from "../controllers/MemberController.js";

export function createMemberRoutes(memberController: MemberController): Router {
  const router = Router();

  // Search members by name or ID
  // GET /api/members/search?q=searchTerm
  router.get("/members/search", (req, res) => memberController.searchMembers(req, res));

  // Add a new member
  // POST /api/members
  router.post("/members", (req, res) => memberController.addMember(req, res));

  // Get all members (optional)
  // GET /api/members
  router.get("/members", (req, res) => memberController.getAllMembers(req, res));

  // Get member by ID (optional)
  // GET /api/members/:id
  router.get("/members/:id", (req, res) => memberController.getMemberById(req, res));

  // Update member by ID
  // PUT /api/members/:id
  router.put("/members/:id", (req, res) => memberController.updateMember(req, res));

  // Delete member by ID
  // DELETE /api/members/:id
  router.delete("/members/:id", (req, res) => memberController.deleteMember(req, res));

  return router;
}
