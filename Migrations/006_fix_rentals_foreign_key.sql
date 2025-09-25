-- Fix foreign key data type mismatch in rentals table
-- bookISBN should be VARCHAR to match Books.ISBN

-- Drop and recreate the rentals table with correct data type
DROP TABLE IF EXISTS rentals;

CREATE TABLE rentals(
    rentalID integer PRIMARY KEY AUTOINCREMENT,
    memberID integer NOT NULL,
    bookISBN VARCHAR(20) NOT NULL,
    returned int DEFAULT 0,
    RentalDate timestamp default CURRENT_TIMESTAMP,
    returnedDate timestamp,
    FOREIGN KEY(memberID) REFERENCES members(id),
    FOREIGN KEY(bookISBN) REFERENCES Books(ISBN)
);