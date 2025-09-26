import type { Book } from "../models/Book.js";

import type { AvailableCopySummary, Copy, RentalWithCopyInfo } from "../models/Copy.js";
import { BookRepository, type Genre, type RentalHistoryEntry } from "../repositories/BookRepository.js";
import { CopyRepository } from "../repositories/CopyRepository.js";


export class BookService {
  private bookRepository: BookRepository;
  private copyRepository: CopyRepository;

  constructor() {
    this.bookRepository = new BookRepository();
    this.copyRepository = new CopyRepository();
  }

  async getAllBooks(): Promise<Book[]> {
    // Get books with copy information
    const booksWithCopies = await this.copyRepository.getAllBooksWithCopies();
    
    // Convert AvailableCopySummary to Book format and add genre information
    const books: Book[] = await Promise.all(
      booksWithCopies.map(async (bookSummary) => {
        // Get genre information for each book
        const bookWithGenres = await this.bookRepository.findByISBN(bookSummary.bookISBN);
        
        return {
          ISBN: bookSummary.bookISBN,
          Title: bookSummary.Title,
          Author: bookSummary.Author,
          PublicationYear: bookSummary.PublicationYear || 0,
          Description: bookSummary.Description || "",
          genres: bookWithGenres?.genres || [],
          totalCopies: bookSummary.totalCopies,
          availableCopies: bookSummary.availableCopies,
          copies: bookSummary.copies
        };
      })
    );
    
    return books;
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

  async getRentals(): Promise<RentalWithCopyInfo[]> {
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
