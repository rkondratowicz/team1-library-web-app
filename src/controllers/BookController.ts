import type { Request, Response } from "express";
import type { Book } from "../models/Book.js";
import type { BookService } from "../services/BookService.js";

export class BookController {
  private bookService: BookService;

  constructor(bookService: BookService) {
    this.bookService = bookService;
  }

  async addBook(req: Request, res: Response): Promise<void> {
    const { title, author, ISBN, publicationYear, description } = req.body;
    const errors: string[] = [];

    if (!title) errors.push("Title is required");
    if (!author) errors.push("Author is required");
    if (!ISBN) errors.push("ISBN is required");
    if (!publicationYear) errors.push("Publication year is required");

    if (errors.length > 0) {
      // Get all books to re-render the page with errors
      const books = await this.bookService.getAllBooks();
      res.status(400).render("books", { books, errors });
      return;
    }

    try {
      await this.bookService.addBook({
        Title: title,
        Author: author,
        ISBN,
        PublicationYear: Number(publicationYear),
        Description: description || "",
      });
      // After successful add, re-fetch books and render
      const books = await this.bookService.getAllBooks();
      res.render("books", { books });
    } catch (error: unknown) {
      const books = await this.bookService.getAllBooks();
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "SQLITE_CONSTRAINT"
      ) {
        res.status(409).render("books", { books, errors: ["ISBN must be unique"] });
      } else {
        res.status(500).render("books", { books, errors: ["Error adding book"] });
      }
    }
  }

  async getAllBooks(_req: Request, res: Response): Promise<void> {
    try {
      const books = await this.bookService.getAllBooks();
      res.render("books", { books: books });
    } catch (_error) {
      const books: Book[] = [];
      res.status(500).render("books", { books, errors: ["Error retrieving books"] });
    }
  }

  async getAllBooksApi(_req: Request, res: Response): Promise<void> {
    try {
      const books = await this.bookService.getAllBooks();
      res.json(books);
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error retrieving books", errors: [String(error)] });
    }
  }

  async getBookByTitle(req: Request, res: Response): Promise<void> {
    try {
      const title = req.params.title;
      const book = await this.bookService.getBookByTitle(title);
      if (!book) {
        res.status(404).json({ success: false, message: "Book not found" });
        return;
      }
      res.json({ success: true, data: book, message: "Book retrieved successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error retrieving book", errors: [String(error)] });
    }
  }

  async searchBooks(req: Request, res: Response): Promise<void> {
    try {
      const searchTerm = req.query.q as string;
      if (!searchTerm) {
        res.status(400).json({ success: false, message: "Search term is required" });
        return;
      }

      const books = await this.bookService.searchBooks(searchTerm);
      res.json(books);
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error searching books", errors: [String(error)] });
    }
  }
}
