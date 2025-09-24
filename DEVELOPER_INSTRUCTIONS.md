# Developer Instructions - Library Management System

## Project Overview

This is a modern library management system built with a 3-tier architecture pattern using TypeScript, Express.js, SQLite, and a DaisyUI frontend. The system follows enterprise-level patterns and modern JavaScript standards.

## ⚠️ CRITICAL REQUIREMENTS

### 1. ES Modules ONLY 
**This project uses ES modules exclusively. NO CommonJS syntax is allowed.**

**✅ Correct ES Module Syntax:**
```typescript
// Imports
import express from 'express';
import { BookService } from './services/BookService.js';
import type { Book } from './models/Book.js';

// Exports
export class BookController { }
export default BookController;
export { BookController };
export type { BookDTO };
```

**❌ NEVER Use CommonJS:**
```javascript
// FORBIDDEN - Do not use these
const express = require('express');
module.exports = BookController;
exports.BookController = BookController;
```

**File Extension Rules:**
- All import statements MUST include `.js` extension (even for `.ts` files)
- TypeScript compiler will resolve these correctly
- Example: `import { Book } from './models/Book.js';`

### 2. Architecture Patterns

This project follows a strict 3-tier architecture:

```
┌─────────────────────────────────────┐
│        PRESENTATION LAYER           │
│  Controllers, Routes, Middleware    │
│   (src/controllers/, src/routes/)   │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│       BUSINESS LOGIC LAYER          │
│      Services, Validation           │
│        (src/services/)              │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│        DATA ACCESS LAYER            │
│   Repositories, Models, Database    │
│ (src/repositories/, src/models/)    │
└─────────────────────────────────────┘
```

**Layer Responsibilities:**
- **Presentation**: HTTP handling, request validation, response formatting
- **Business Logic**: Business rules, data validation, service orchestration  
- **Data Access**: Database operations, data mapping, persistence

**Dependency Rules:**
- Controllers can only call Services
- Services can only call Repositories
- Repositories handle database operations
- NO cross-layer dependencies (e.g., Controllers calling Repositories directly)

### 3. Development Environment Setup

**Prerequisites:**
- Node.js 18+ (ES modules support)
- npm 8+
- SQLite3

**Initial Setup:**
```bash
# Clone repository
git clone <repository-url>
cd team1-library-web-app-1

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start development server
npm run dev

# Start production server
npm start
```

### 4. File Structure & Naming Conventions

```
src/
├── app.ts                 # Main application entry point
├── container.ts           # Dependency injection container
├── controllers/           # HTTP request handlers
│   ├── BaseController.ts  # Base controller with common functionality
│   └── BookController.ts  # Book-specific HTTP handlers
├── services/              # Business logic layer
│   └── BookService.ts     # Book business operations
├── repositories/          # Data access layer
│   └── BookRepository.ts  # Book database operations
├── models/                # Type definitions and DTOs
│   ├── Book.ts           # Book entity and types
│   ├── Repository.ts     # Generic repository interface
│   └── Service.ts        # Generic service interface
├── routes/                # Route definitions
│   └── BookRoutes.ts     # Book API endpoints
├── middleware/            # Custom middleware
│   └── index.ts          # CORS, error handling, logging
├── config/               # Configuration
│   └── database.ts       # Database connection setup
└── utils/                # Utility functions
    └── index.ts          # Helper functions
```

**Naming Conventions:**
- Files: PascalCase for classes (`BookController.ts`), camelCase for utilities (`database.ts`)
- Classes: PascalCase (`BookService`, `BookRepository`)
- Functions/Methods: camelCase (`getAllBooks`, `createBook`)
- Constants: UPPER_SNAKE_CASE (`DATABASE_PATH`)
- Types/Interfaces: PascalCase (`Book`, `BookDTO`)

### 5. Code Quality Standards

**ESLint & Biome:**
- Use Biome for linting and formatting
- Run `npm run lint` before commits
- Run `npm run format` to auto-format code

**TypeScript Standards:**
- Strict mode enabled
- No `any` types allowed
- Use proper type definitions
- Export types separately: `export type { Book }`

**Error Handling:**
- Use custom error classes
- Consistent error response format
- Proper HTTP status codes
- Log errors appropriately

### 6. Database Operations

**Repository Pattern:**
```typescript
export class BookRepository implements Repository<Book> {
  async findAll(): Promise<Book[]> {
    // Database logic only
  }
  
  async create(book: Book): Promise<Book> {
    // Database logic only
  }
}
```

**Service Layer Validation:**
```typescript
export class BookService implements Service<Book> {
  async createBook(bookData: CreateBookRequest): Promise<Book> {
    // 1. Validate input
    // 2. Apply business rules
    // 3. Call repository
    // 4. Return result
  }
}
```

### 7. API Development Guidelines

**RESTful Endpoints:**
- Use proper HTTP verbs (GET, POST, PUT, DELETE)
- Consistent response format:
```typescript
{
  success: boolean;
  data?: any;
  message: string;
  errors?: string[];
}
```

**Controller Pattern:**
```typescript
export class BookController extends BaseController {
  async getAllBooks(req: Request, res: Response): Promise<void> {
    try {
      const books = await this.bookService.getAllBooks();
      this.sendSuccess(res, books, 'Books retrieved successfully');
    } catch (error) {
      this.handleError(res, error);
    }
  }
}
```

### 8. Frontend Integration

**DaisyUI Components:**
- Use DaisyUI v5.1.14 components
- Follow Tailwind CSS utility-first approach
- Responsive design required
- Accessibility considerations

**JavaScript (Frontend):**
- ES modules in browser context
- Async/await for API calls
- Error handling for API responses
- Modern DOM manipulation

### 9. Git Workflow

**Branch Strategy:**
- `main`: Production-ready code
- Feature branches: `feature/description`
- Use descriptive commit messages

**Before Committing:**
```bash
npm run lint      # Check linting
npm run build     # Ensure TypeScript compiles
npm test          # Run tests (when available)
```

### 10. Testing Strategy

**Unit Tests:**
- Test business logic in Services
- Mock dependencies
- Use Jest with ES module support

**Integration Tests:**
- Test API endpoints
- Test database operations
- Test full request/response cycle

### 11. Configuration Management

**Environment Variables:**
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `DB_PATH`: Database file path

**TypeScript Configuration:**
- ES2022 target
- ESNext module system
- Strict type checking
- Path mapping for clean imports

### 12. Common Pitfalls to Avoid

❌ **Don't:**
- Use CommonJS syntax (`require`, `module.exports`)
- Import without file extensions
- Skip the service layer in controllers
- Put business logic in controllers or repositories
- Use `any` type
- Ignore TypeScript errors

✅ **Do:**
- Always use ES module syntax
- Include `.js` extensions in imports
- Follow the 3-tier architecture
- Use proper error handling
- Write type-safe code
- Test your changes

### 13. Deployment Considerations

**Production Build:**
```bash
npm run clean     # Clean previous builds
npm run build     # Compile TypeScript
npm start         # Start production server
```

**Environment Setup:**
- Node.js production environment
- SQLite database file permissions
- Static file serving configuration
- Process management (PM2 recommended)

---

## Quick Reference Commands

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm run clean        # Clean build directory
npm run lint         # Run Biome linting
npm run format       # Format code with Biome

# Production
npm start            # Start production server
npm run build:prod   # Production build (if available)

# Database
npm run migrate      # Run database migrations (if available)
npm run seed         # Seed database with sample data (if available)
```

---

## Support & Documentation

- **API Documentation**: `/docs/API_ENDPOINTS.md`
- **Architecture Documentation**: `ARCHITECTURE.md`
- **Project Structure**: This file
- **Change Log**: Check git commit history

---

**Last Updated**: September 24, 2025  
**Project Version**: 2.0.0  
**Node.js Version**: 18+  
**TypeScript Version**: 5.0+