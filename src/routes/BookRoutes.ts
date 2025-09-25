import { Router } from "express";
import type { BookController } from "../controllers/BookController.js";

export function createBookRoutes(bookController: BookController): Router {
  const router = Router();

  router.get("/books", (req, res) => bookController.getAllBooks(req, res));
  router.get("/getBook/:title", (req, res) => bookController.getBookByTitle(req, res));

  // Add new book
  router.post("/books/add", (req, res) => bookController.addBook(req, res));

  // Edit existing book
  router.post("/books/edit", (req, res) => bookController.editBook(req, res));

  return router;
}
