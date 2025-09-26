import { Router } from "express";
import type { MemberController } from "../controllers/memberController.js";

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

  // Get member rentals
  // GET /api/members/:id/rentals
  router.get("/members/:id/rentals", (req, res) => memberController.getMemberRentals(req, res));

  // Update member by ID
  // PUT /api/members/:id
  router.put("/members/:id", (req, res) => memberController.updateMember(req, res));

  // Rent a specific copy
  // POST /api/members/:id/rent-copy/:copyId
  router.post("/members/:id/rent-copy/:copyId", (req, res) => {
    memberController.rentCopy(req, res);
  });

  // Return a specific copy
  // POST /api/members/:id/return-copy/:copyId
  router.post("/members/:id/return-copy/:copyId", (req, res) => {
    memberController.returnCopy(req, res);
  });

  // Legacy routes for backward compatibility
  router.post("/members/:id/rental/:bookTitle", (req, res) => {
    memberController.rentBook(req, res);
  });

  // Return a book
  // POST /api/members/:id/return/:bookISBN
  router.post("/members/:id/return/:bookISBN", (req, res) => {
    memberController.returnBook(req, res);
  });

  // Delete member by ID
  // DELETE /api/members/:id
  router.delete("/members/:id", (req, res) => memberController.deleteMember(req, res));

  return router;
}
