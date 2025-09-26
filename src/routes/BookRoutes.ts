import { Router } from "express";
import type { BookController } from "../controllers/BookController.js";

export function createBookRoutes(bookController: BookController): Router {
  const router = Router();

  router.get("/books", (req, res) => bookController.getAllBooksApi(req, res));
  router.get("/books-with-copies", (req, res) => bookController.getAllBooksWithCopies(req, res));
  router.get("/books/search", (req, res) => bookController.searchBooks(req, res));
  router.get("/getBook/:title", (req, res) => bookController.getBookByTitle(req, res));
  router.get("/books/:isbn/details", (req, res) => bookController.getBookDetails(req, res));
  router.get("/genres", (req, res) => bookController.getAllGenres(req, res));

  // Add new book
  router.post("/books/add", (req, res) => bookController.addBook(req, res));

  // Edit existing book
  router.post("/books/edit", (req, res) => bookController.editBook(req, res));

  // Delete book
  router.post("/books/delete", (req, res) => bookController.deleteBook(req, res));

  router.get("/books/rentals", (req, res) => bookController.getRentals(req, res));
  return router;
}
