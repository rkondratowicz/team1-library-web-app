import type { Book } from "../models/Book.js";
import type { AvailableCopySummary, Copy } from "../models/Copy.js";
import { BookRepository } from "../repositories/BookRepository.js";
import { CopyRepository } from "../repositories/CopyRepository.js";

export class BookService {
  private bookRepository: BookRepository;
  private copyRepository: CopyRepository;

  constructor() {
    this.bookRepository = new BookRepository();
    this.copyRepository = new CopyRepository();
  }

  async getAllBooks(): Promise<Book[]> {
    return await this.bookRepository.findAll();
  }

  // Get all books with their copy information
  async getAllBooksWithCopies(): Promise<AvailableCopySummary[]> {
    return await this.copyRepository.getAllBooksWithCopies();
  }

  async getBookByTitle(title: string): Promise<Book | undefined> {
    return await this.bookRepository.findByTitle(title);
  }

  // Get available copies for a specific book by ISBN
  async getAvailableCopies(isbn: string): Promise<Copy[]> {
    return await this.copyRepository.findAvailableByISBN(isbn);
  }

  // Check if any copies are available for a book by title
  async bookAvailable(bookTitle: string): Promise<boolean> {
    const book = await this.bookRepository.findByTitle(bookTitle);
    if (!book) return false;
    
    const availableCopies = await this.copyRepository.findAvailableByISBN(book.ISBN);
    return availableCopies.length > 0;
  }

  // Check if a specific copy is available
  async copyAvailable(copyID: number): Promise<boolean> {
    return await this.copyRepository.isAvailable(copyID);
  }
  async getRentals(): Promise<any[]> {
    return await this.bookRepository.getRentals();
  }
  async addBook(book: Book): Promise<Book> {
    return await this.bookRepository.create(book);
  }

  async editBook(book: Book): Promise<void> {
    await this.bookRepository.update(book);
  }

  async searchBooks(searchTerm: string): Promise<Book[]> {
    return await this.bookRepository.searchBooks(searchTerm);
  }

  async deleteBook(isbn: string): Promise<void> {
    await this.bookRepository.delete(isbn);
  }
}
