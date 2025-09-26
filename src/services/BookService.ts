import type { Book } from "../models/Book.js";
import {
  BookRepository,
  type Genre,
  type RentalHistoryEntry,
} from "../repositories/BookRepository.js";

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

  async addBook(book: Book, genres?: string[]): Promise<Book> {
    if (genres && genres.length > 0) {
      // Find or create genre IDs
      const genreIds: number[] = [];
      for (const genreName of genres) {
        const genreId = await this.bookRepository.findOrCreateGenre(genreName);
        genreIds.push(genreId);
      }
      return await this.bookRepository.createWithGenres(book, genreIds);
    } else {
      return await this.bookRepository.create(book);
    }
  }

  async getRentals(): Promise<RentalHistoryEntry[]> {
    return await this.bookRepository.getRentals();
  }

  async editBook(book: Book, genres?: string[]): Promise<void> {
    if (genres !== undefined) {
      // Find or create genre IDs
      const genreIds: number[] = [];
      for (const genreName of genres) {
        const genreId = await this.bookRepository.findOrCreateGenre(genreName);
        genreIds.push(genreId);
      }
      await this.bookRepository.updateWithGenres(book, genreIds);
    } else {
      await this.bookRepository.update(book);
    }
  }

  async searchBooks(searchTerm: string): Promise<Book[]> {
    return await this.bookRepository.searchBooks(searchTerm);
  }

  async deleteBook(isbn: string): Promise<void> {
    await this.bookRepository.deleteWithCleanup(isbn);
  }

  async getAllGenres(): Promise<Genre[]> {
    return await this.bookRepository.getAllGenres();
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
