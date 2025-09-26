-- Migration to update rentals table to reference individual copies
-- This enables proper copy-based rental tracking

-- First, backup existing rental data if needed
-- Create a backup table for existing rentals
CREATE TABLE rentals_backup AS SELECT * FROM rentals;

-- Drop the current rentals table
DROP TABLE rentals;

-- Create new rentals table that references copyID instead of bookISBN
CREATE TABLE rentals (
    rentalID INTEGER PRIMARY KEY AUTOINCREMENT,
    memberID INTEGER NOT NULL,
    copyID INTEGER NOT NULL,
    returned INT DEFAULT 0,
    RentalDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returnedDate TIMESTAMP,
    FOREIGN KEY (memberID) REFERENCES members(id),
    FOREIGN KEY (copyID) REFERENCES copy(copyID)
);

-- Note: Existing rental data will need to be migrated manually if needed
-- This migration assumes starting fresh or that existing rentals can be archived