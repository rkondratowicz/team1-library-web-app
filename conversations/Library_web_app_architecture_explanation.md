# Library Web App Architecture Explanation

## Overview
This document explains the structure of the `src` directory and how all components work together using the Book functionality as an example. The application follows a **3-tier architecture pattern**.

## Architecture Overview

```
┌─────────────────────────────────────┐
│        PRESENTATION LAYER           │
│     Controllers + Routes            │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│       BUSINESS LOGIC LAYER          │
│           Services                  │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│        DATA ACCESS LAYER            │
│    Repositories + Models            │
└─────────────────────────────────────┘
```

## Directory Structure & Responsibilities

### 1. **Models** (`src/models`)
**Purpose**: Define data structures and types
- Contains TypeScript interfaces and types
- Represents the shape of your data entities

**Example**: `Book.ts`
```typescript
export interface Book {
  BookID: number;
  title: string;
  author: string;
}
```

### 2. **Repositories** (`src/repositories`)
**Purpose**: Handle all database operations
- Direct database interaction (SQLite queries)
- CRUD operations (Create, Read, Update, Delete)
- Returns raw data from database

**Example**: `BookRepository.ts`
```typescript
export class BookRepository {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(DATABASE_PATH);
  }

  findAll(): Promise<Book[]> {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM books", (err: unknown, rows: Book[]) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  findByTitle(title: string): Promise<Book | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM books WHERE title=?",
        [title],
        (err: unknown, row: Book | undefined) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }
}
```

### 3. **Services** (`src/services`)
**Purpose**: Contains business logic and rules
- Validates data before saving
- Applies business rules (e.g., borrowing limits)
- Coordinates between repositories
- Transforms data as needed

**Example**: `BookService.ts`
```typescript
export class BookService {
  async getAllBooks(): Promise<Book[]> {
    // Business logic + calls repository
    return await this.bookRepository.findAll();
  }
  
  async getBookByTitle(title: string): Promise<Book | undefined> {
    // Validation + business rules + repository call
    return await this.bookRepository.findByTitle(title);
  }
}
```

### 4. **Controllers** (`src/controllers`)
**Purpose**: Handle HTTP requests and responses
- Receive HTTP requests
- Call appropriate service methods
- Format responses (JSON or render views)
- Handle errors and send appropriate HTTP status codes

**Example**: `BookController.ts`
```typescript
export class BookController {
  async getAllBooks(_req: Request, res: Response): Promise<void> {
    try {
      const books = await this.bookService.getAllBooks();
      res.render("books", { books: books }); // Renders EJS view
    } catch (error) {
      res.status(500).json({ success: false, message: "Error retrieving books" });
    }
  }
}
```

### 5. **Routes** (`src/routes`)
**Purpose**: Define API endpoints and HTTP routing
- Maps URLs to controller methods
- Defines HTTP methods (GET, POST, PUT, DELETE)
- Groups related endpoints together

**Example**: `BookRoutes.ts`
```typescript
import { Router } from "express";
import type { BookController } from "../controllers/BookController.js";

export function createBookRoutes(bookController: BookController): Router {
  const router = Router();

  router.get("/books", (req, res) => bookController.getAllBooks(req, res));
  router.get("/getBook/:title", (req, res) => bookController.getBookByTitle(req, res));

  return router;
}
```

### 6. **Utils** (`src/utils`)
**Purpose**: Helper functions and utilities
- Shared utility functions
- Common operations used across the app
- Pure functions that don't depend on other layers

**Example**: `index.ts`
```typescript
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

## Complete Data Flow Example

### Example: User requests `/api/books`

Let's trace through what happens when someone visits `http://localhost:3000/api/books`:

#### Sample Database Data
**Database Table: `books`**
```sql
BookID | title                    | author
-------|--------------------------|------------------
1      | "To Kill a Mockingbird" | "Harper Lee"
2      | "1984"                   | "George Orwell"
3      | "Pride and Prejudice"    | "Jane Austen"
```

#### Step-by-Step Data Flow:

1. **HTTP Request**: `GET /api/books`

2. **Route Layer** - `BookRoutes.ts`:
   ```typescript
   // User hits: GET /api/books
   router.get("/books", (req, res) => bookController.getAllBooks(req, res));
   // Route matches and calls controller method
   ```

3. **Controller Layer** - `BookController.ts`:
   ```typescript
   async getAllBooks(_req: Request, res: Response): Promise<void> {
     try {
       console.log("📝 Controller: Received request for all books");
       
       // Calls service layer
       const books = await this.bookService.getAllBooks();
       
       console.log(`📝 Controller: Got ${books.length} books from service`);
       
       // Renders EJS template with book data
       res.render("books", { books: books });
     } catch (error) {
       res.status(500).json({ success: false, message: "Error retrieving books" });
     }
   }
   ```

4. **Service Layer** - `BookService.ts`:
   ```typescript
   async getAllBooks(): Promise<Book[]> {
     console.log("🔧 Service: Processing request for all books");
     
     // Business logic could go here (filtering, sorting, validation)
     // For now, just calls repository
     const books = await this.bookRepository.findAll();
     
     console.log(`🔧 Service: Retrieved ${books.length} books from repository`);
     
     // Could transform data here if needed
     return books;
   }
   ```

5. **Repository Layer** - `BookRepository.ts`:
   ```typescript
   findAll(): Promise<Book[]> {
     console.log("💾 Repository: Executing SQL query for all books");
     
     return new Promise((resolve, reject) => {
       this.db.all("SELECT * FROM books", (err: unknown, rows: Book[]) => {
         if (err) {
           console.error("💾 Repository: Database error:", err);
           return reject(err);
         } else {
           console.log(`💾 Repository: Found ${rows.length} books in database`);
           resolve(rows);
         }
       });
     });
   }
   ```

6. **Database Returns**:
   ```javascript
   [
     { BookID: 1, title: "To Kill a Mockingbird", author: "Harper Lee" },
     { BookID: 2, title: "1984", author: "George Orwell" },
     { BookID: 3, title: "Pride and Prejudice", author: "Jane Austen" }
   ]
   ```

7. **Final HTML Response** (rendered by EJS):
   ```html
   <div class="books-list">
     <div class="book">
       <h3>To Kill a Mockingbird</h3>
       <p>by Harper Lee</p>
       <span>ID: 1</span>
     </div>
     <div class="book">
       <h3>1984</h3>
       <p>by George Orwell</p>
       <span>ID: 2</span>
     </div>
     <div class="book">
       <h3>Pride and Prejudice</h3>
       <p>by Jane Austen</p>
       <span>ID: 3</span>
     </div>
   </div>
   ```

#### Console Output During Request:
```
📝 Controller: Received request for all books
🔧 Service: Processing request for all books
💾 Repository: Executing SQL query for all books
💾 Repository: Found 3 books in database
🔧 Service: Retrieved 3 books from repository
📝 Controller: Got 3 books from service
```

## Dependency Injection in `src/app.ts`

```typescript
// Create instances in correct order
const bookRepository = new BookRepository();           // Data layer
const bookService = new BookService(bookRepository);  // Business layer  
const bookController = new BookController(bookService); // Presentation layer

// Wire up routes
app.use("/api", createBookRoutes(bookController));
```

## Key Benefits of This Structure

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Testability**: Easy to mock dependencies and test each layer
3. **Maintainability**: Changes in one layer don't affect others
4. **Scalability**: Easy to add new features following the same pattern
5. **Type Safety**: TypeScript interfaces ensure data consistency

## Data Flow Summary

Data flows **down** through the layers:
- Request → Routes → Controllers → Services → Repositories → Database

And **back up** with the actual data:
- Database → Repositories → Services → Controllers → Response

This architecture ensures your application is well-organized, maintainable, and follows enterprise-level best practices!

---
*Generated on: September 24, 2025*
*Project: Team 1 Library Web App*