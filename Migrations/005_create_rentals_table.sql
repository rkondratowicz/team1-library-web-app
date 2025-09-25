CREATE TABLE rentals(
    rentalID integer PRIMARY KEY AUTOINCREMENT,
    memberID integer NOT NULL,
    bookISBN integer NOT NULL,
    returned int DEFAULT 0,
    RentalDate timestamp default CURRENT_TIMESTAMP,
    returnedDate timestamp,
    FOREIGN KEY(memberID) REFERENCES members(id),
    FOREIGN KEY(bookISBN) REFERENCES Books(ISBN)
)