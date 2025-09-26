import type { Book } from "../models/Book.js";
import { BookRepository, type RentalHistoryEntry } from "../repositories/BookRepository.js";

export class BookService {
  private bookRepository: BookRepository;

  constructor() {
    this.bookRepository = new BookRepository();
  }

  async getAllBooks(): Promise<Book[]> {
    return await this.bookRepository.findAll();
  }

  async getBookByTitle(title: string): Promise<Book | undefined> {
    return await this.bookRepository.findByTitle(title);
  }

  async bookAvailable(bookTitle: string): Promise<boolean> {
    const book = await this.bookRepository.findByTitle(bookTitle);
    let status: boolean = false;
    if (book?.available !== undefined) {
      if (book.available > 0) {
        status = true;
      } else {
        status = false;
      }
    }
    return status;
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

  async getBookDetails(isbn: string): Promise<BookDetails | undefined> {
    const book = await this.bookRepository.findByISBN(isbn);
    if (!book) {
      return undefined;
    }

    const rentalHistory = await this.bookRepository.findRentalHistory(isbn);

    return {
      book,
      rentalHistory,
      currentlyBorrowed: rentalHistory.some((rental) => !rental.returned),
      totalRentals: rentalHistory.length,
    };
  }
}

export interface BookDetails {
  book: Book;
  rentalHistory: RentalHistoryEntry[];
  currentlyBorrowed: boolean;
  totalRentals: number;
}
