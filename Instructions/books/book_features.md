# Book Features Specification

## Book Catalog
- Add new books (title, author(s), ISBN, genre, publication year, description)
- Edit book information
- Delete books (only if no active borrows)
- Search & filter books (title, author, ISBN, genre, publication year)
- View book details (all metadata, available copies)

## Copy Management
- Add copies (unique copy IDs per book)
- Track copy status (Available, Borrowed)
- View borrowing history for each copy

## Book Management Rules
- Cannot delete books with active borrows
- ISBN must be unique per book
- Copy IDs must be unique across collection

## Data Structure
- Book metadata: title, author, ISBN, genre, publication year, description
- Copies: copy ID, status, borrower
- Borrowing history per book and copy

## UI Features
- Books section: catalog management, copy tracking
- Book details view: all info, available copies
- Sortable/filterable book lists
- Bulk actions for books/copies
- Export options (CSV/PDF)
