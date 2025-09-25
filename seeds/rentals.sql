-- Seed data for rentals table
-- Note: returnedDate is left NULL to indicate books are currently rented out
-- Member IDs: 1-20 (from members seed data)
-- Book ISBNs: Available from books seed data

INSERT INTO rentals (memberID, bookISBN, returned, RentalDate, returnedDate) VALUES
-- Active rentals (returned = 0, returnedDate = NULL)
(1, 9780061120084, 0, '2025-09-01 10:30:00', NULL),  -- John Smith rented "To Kill a Mockingbird"
(2, 9780451524935, 0, '2025-09-02 14:15:00', NULL),  -- Emma Johnson rented "1984"
(3, 9780743273565, 0, '2025-09-03 09:45:00', NULL),  -- Michael Brown rented "The Great Gatsby"
(4, 9780316769488, 0, '2025-09-05 11:20:00', NULL),  -- Sarah Davis rented "The Catcher in the Rye"
(5, 9781503280786, 0, '2025-09-06 16:00:00', NULL),  -- James Wilson rented "Moby Dick"
(6, 9780141439518, 0, '2025-09-08 13:30:00', NULL),  -- Jessica Taylor rented "Pride and Prejudice"
(7, 9780547928227, 0, '2025-09-10 12:15:00', NULL),  -- David Anderson rented "The Hobbit"
(8, 9780060850524, 0, '2025-09-12 15:45:00', NULL),  -- Emily Thomas rented "Brave New World"
(9, 9780375842207, 0, '2025-09-14 10:00:00', NULL),  -- Daniel Jackson rented "The Book Thief"
(10, 9780307387899, 0, '2025-09-15 14:30:00', NULL), -- Sophie White rented "The Road"
(11, 9780061122415, 0, '2025-09-17 11:45:00', NULL), -- Matthew Harris rented "The Alchemist"
(12, 9780199232765, 0, '2025-09-18 09:20:00', NULL), -- Olivia Martin rented "War and Peace"
(13, 9780140449136, 0, '2025-09-19 16:10:00', NULL), -- Andrew Thompson rented "Crime and Punishment"
(14, 9780141441146, 0, '2025-09-20 13:00:00', NULL), -- Charlotte Garcia rented "Jane Eyre"
(15, 9780141439556, 0, '2025-09-21 10:45:00', NULL), -- Christopher Martinez rented "Wuthering Heights"

-- Some members with multiple rentals (within 3 book limit)
(1, 9780618640157, 0, '2025-09-22 12:30:00', NULL),  -- John Smith's second book "The Lord of the Rings"
(2, 9781594631931, 0, '2025-09-22 15:20:00', NULL),  -- Emma Johnson's second book "The Kite Runner"
(3, 9780307474278, 0, '2025-09-23 11:15:00', NULL),  -- Michael Brown's second book "The Da Vinci Code"
(4, 9780439023528, 0, '2025-09-23 14:40:00', NULL),  -- Sarah Davis's second book "The Hunger Games"
(5, 9780590353427, 0, '2025-09-24 09:30:00', NULL),  -- James Wilson's second book "Harry Potter"

-- Some members at their 3-book limit
(1, 9780142424179, 0, '2025-09-24 16:45:00', NULL),  -- John Smith's third book "The Fault in Our Stars"
(2, 9780307588371, 0, '2025-09-25 10:15:00', NULL),  -- Emma Johnson's third book "Gone Girl"
(3, 9781594204489, 0, '2025-09-25 13:50:00', NULL);  -- Michael Brown's third book "The Girl on the Train"