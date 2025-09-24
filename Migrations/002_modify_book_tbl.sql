-- Migration: Modify Books table to match PRD requirements
-- Adds ISBN (primary key), Author, Title, PublicationYear, Description

DROP TABLE IF EXISTS Books;

CREATE TABLE Books (
    ISBN VARCHAR(20) PRIMARY KEY,
    Author VARCHAR(255) NOT NULL,
    Title VARCHAR(255) NOT NULL,
    PublicationYear INT,
    Description TEXT
);
