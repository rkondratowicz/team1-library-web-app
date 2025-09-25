import type { Book } from "../models/Book.js";
import type { BookRepository } from "../repositories/BookRepository.js";

export class BookService {
  private bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async getAllBooks(): Promise<Book[]> {
    return await this.bookRepository.findAll();
  }

  async getBookByTitle(title: string): Promise<Book | undefined> {
    return await this.bookRepository.findByTitle(title);
  }

  async searchBooks(searchTerm: string): Promise<Book[]> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return await this.bookRepository.findAll();
    }
    return await this.bookRepository.searchBooks(searchTerm.trim());
  }

  async addBook(book: Book): Promise<Book> {
    return await this.bookRepository.create(book);
  }

  async editBook(book: Book): Promise<void> {
    await this.bookRepository.update(book);
  }
}
