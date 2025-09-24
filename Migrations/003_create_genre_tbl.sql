-- Migration: Create Genre table and link table for m:n relationship with Books

CREATE TABLE Genre (
    GenreID INTEGER PRIMARY KEY AUTOINCREMENT,
    Genre VARCHAR(100) NOT NULL
);

-- Link table for Books and Genre (many-to-many)
CREATE TABLE BookGenre (
    ISBN VARCHAR(20) NOT NULL,
    GenreID INTEGER NOT NULL,
    PRIMARY KEY (ISBN, GenreID),
    FOREIGN KEY (ISBN) REFERENCES Books(ISBN),
    FOREIGN KEY (GenreID) REFERENCES Genre(GenreID)
);
