import type { Request, Response } from "express";
import type { BookService } from "../services/BookService.js";

export class BookController {
  private bookService: BookService;

  constructor(bookService: BookService) {
    this.bookService = bookService;
  }

  async getAllBooks(req: Request, res: Response): Promise<void> {
    try {
      const books = await this.bookService.getAllBooks();
      res.json({ success: true, data: books, message: "Books retrieved successfully" });
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
}
