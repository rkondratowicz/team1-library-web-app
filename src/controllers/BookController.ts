import type { Request, Response } from "express";
import type { Book } from "../models/Book.js";
import { BookService } from "../services/BookService.js";

export class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  async addBook(req: Request, res: Response): Promise<void> {
    const { Title, Author, ISBN, PublicationYear, Description } = req.body;
    const errors: string[] = [];

    if (!Title) errors.push("Title is required");
    if (!Author) errors.push("Author is required");
    if (!ISBN) errors.push("ISBN is required");
    if (!PublicationYear) errors.push("Publication year is required");

    if (errors.length > 0) {
      // Get all books to re-render the page with errors
      const books = await this.bookService.getAllBooks();
      res.status(400).render("books", { books, errors });
      return;
    }

    try {
      await this.bookService.addBook({
        Title,
        Author,
        ISBN,
        PublicationYear: Number(PublicationYear),
        Description: Description || "",
      });
      // After successful add, re-fetch books and render
      res.redirect("/books");
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
  async editBook(req: Request, res: Response): Promise<void> {
    const { ISBN, Title, Author, PublicationYear, Description } = req.body;
    const errors: string[] = [];

    console.log("Edit Book Request Body:", req.body);

    if (!Title) errors.push("Title is required");
    if (!Author) errors.push("Author is required");
    if (!ISBN) errors.push("ISBN is required");
    if (!PublicationYear) errors.push("Publication year is required");

    if (errors.length > 0) {
      console.log("Validation errors:", errors);
      const books = await this.bookService.getAllBooks();
      res.status(400).render("books", { books, errors });
      return;
    }

    try {
      await this.bookService.editBook({
        ISBN,
        Title,
        Author,
        PublicationYear: Number(PublicationYear),
        Description: Description || "",
      });
      res.redirect("/books");
    } catch (_serror: unknown) {
      const books = await this.bookService.getAllBooks();
      res.status(500).render("books", { books, errors: ["Error editing book"] });
    }
  }

  async deleteBook(req: Request, res: Response): Promise<void> {
    const { ISBN } = req.body;
    const errors: string[] = [];

    if (!ISBN) {
      errors.push("ISBN is required");
    }

    if (errors.length > 0) {
      const books = await this.bookService.getAllBooks();
      res.status(400).render("books", { books, errors });
      return;
    }

    try {
      await this.bookService.deleteBook(ISBN);
      res.redirect("/books");
    } catch (_error: unknown) {
      const books = await this.bookService.getAllBooks();
      res.status(500).render("books", { books, errors: ["Error deleting book"] });
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

  async getBookDetails(req: Request, res: Response): Promise<void> {
    try {
      const isbn = req.params.isbn;
      console.log("BookController.getBookDetails called with ISBN:", isbn);

      if (!isbn) {
        res.status(400).json({ success: false, message: "ISBN is required" });
        return;
      }

      const bookDetails = await this.bookService.getBookDetails(isbn);
      console.log("BookDetails result:", bookDetails);

      if (!bookDetails) {
        res.status(404).json({ success: false, message: "Book not found" });
        return;
      }

      res.json({
        success: true,
        data: bookDetails,
        message: "Book details retrieved successfully",
      });
    } catch (error) {
      console.error("Error in BookController.getBookDetails:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Error retrieving book details",
          errors: [String(error)],
        });
    }
  }
}
