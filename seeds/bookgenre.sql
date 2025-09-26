-- Sample data for BookGenre table (bridging table for Books and Genre)
-- This assigns genres to books based on ISBN and GenreID
-- Note: Many books have multiple genres, which is why we have multiple entries per book

-- To Kill a Mockingbird (Classic Literature, Fiction, Drama)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780061120084', 1),  -- Fiction
('9780061120084', 21), -- Drama
('9780061120084', 26); -- Classic Literature

-- 1984 (Science Fiction, Fiction, Classic Literature)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780451524935', 3),  -- Science Fiction
('9780451524935', 1),  -- Fiction
('9780451524935', 26); -- Classic Literature

-- The Great Gatsby (Fiction, Classic Literature, Romance)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780743273565', 1),  -- Fiction
('9780743273565', 7),  -- Romance
('9780743273565', 26); -- Classic Literature

-- The Catcher in the Rye (Fiction, Classic Literature, Young Adult)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780316769488', 1),  -- Fiction
('9780316769488', 24), -- Young Adult
('9780316769488', 26); -- Classic Literature

-- Moby Dick (Fiction, Classic Literature, Adventure)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9781503280786', 1),  -- Fiction
('9781503280786', 22), -- Adventure
('9781503280786', 26); -- Classic Literature

-- Pride and Prejudice (Romance, Fiction, Classic Literature)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780141439518', 7),  -- Romance
('9780141439518', 1),  -- Fiction
('9780141439518', 26); -- Classic Literature

-- The Hobbit (Fantasy, Adventure, Children's Literature)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780547928227', 4),  -- Fantasy
('9780547928227', 22), -- Adventure
('9780547928227', 25); -- Children's Literature

-- Brave New World (Science Fiction, Fiction, Classic Literature)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780060850524', 3),  -- Science Fiction
('9780060850524', 1),  -- Fiction
('9780060850524', 26); -- Classic Literature

-- The Book Thief (Historical Fiction, Fiction, Young Adult)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780375842207', 28), -- Historical Fiction
('9780375842207', 1),  -- Fiction
('9780375842207', 24); -- Young Adult

-- The Road (Fiction, Science Fiction, Adventure)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780307387899', 1),  -- Fiction
('9780307387899', 3),  -- Science Fiction
('9780307387899', 22); -- Adventure

-- The Alchemist (Fiction, Philosophy, Adventure)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780061122415', 1),  -- Fiction
('9780061122415', 11), -- Philosophy
('9780061122415', 22); -- Adventure

-- War and Peace (Historical Fiction, Classic Literature, Fiction)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780199232765', 28), -- Historical Fiction
('9780199232765', 26), -- Classic Literature
('9780199232765', 1);  -- Fiction

-- Crime and Punishment (Fiction, Classic Literature, Crime)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780140449136', 1),  -- Fiction
('9780140449136', 23), -- Crime
('9780140449136', 26); -- Classic Literature

-- Jane Eyre (Romance, Fiction, Classic Literature)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780141441146', 7),  -- Romance
('9780141441146', 1),  -- Fiction
('9780141441146', 26); -- Classic Literature

-- Wuthering Heights (Romance, Fiction, Classic Literature)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780141439556', 7),  -- Romance
('9780141439556', 1),  -- Fiction
('9780141439556', 26); -- Classic Literature

-- The Lord of the Rings (Fantasy, Adventure, Fiction)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780618640157', 4),  -- Fantasy
('9780618640157', 22), -- Adventure
('9780618640157', 1);  -- Fiction

-- The Kite Runner (Fiction, Contemporary Fiction, Drama)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9781594631931', 1),  -- Fiction
('9781594631931', 27), -- Contemporary Fiction
('9781594631931', 21); -- Drama

-- The Da Vinci Code (Mystery, Thriller, Adventure)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780307474278', 5),  -- Mystery
('9780307474278', 6),  -- Thriller
('9780307474278', 22); -- Adventure

-- The Hunger Games (Science Fiction, Young Adult, Adventure)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780439023528', 3),  -- Science Fiction
('9780439023528', 24), -- Young Adult
('9780439023528', 22); -- Adventure

-- Harry Potter and the Stone (Fantasy, Children's Literature, Adventure)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780590353427', 4),  -- Fantasy
('9780590353427', 25), -- Children's Literature
('9780590353427', 22); -- Adventure

-- The Fault in Our Stars (Young Adult, Romance, Contemporary Fiction)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780142424179', 24), -- Young Adult
('9780142424179', 7),  -- Romance
('9780142424179', 27); -- Contemporary Fiction

-- Gone Girl (Thriller, Mystery, Crime)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780307588371', 6),  -- Thriller
('9780307588371', 5),  -- Mystery
('9780307588371', 23); -- Crime

-- The Girl on the Train (Thriller, Mystery, Crime)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9781594204489', 6),  -- Thriller
('9781594204489', 5),  -- Mystery
('9781594204489', 23); -- Crime

-- Memoirs of a Geisha (Historical Fiction, Fiction, Romance)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780679781585', 28), -- Historical Fiction
('9780679781585', 1),  -- Fiction
('9780679781585', 7);  -- Romance

-- Life of Pi (Adventure, Fantasy, Fiction)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780156027328', 22), -- Adventure
('9780156027328', 4),  -- Fantasy
('9780156027328', 1);  -- Fiction

-- The Shining (Horror, Thriller, Fiction)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780307743657', 8),  -- Horror
('9780307743657', 6),  -- Thriller
('9780307743657', 1);  -- Fiction

-- The Stand (Horror, Science Fiction, Fantasy)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780307743688', 8),  -- Horror
('9780307743688', 3),  -- Science Fiction
('9780307743688', 4);  -- Fantasy

-- It (Horror, Thriller, Fiction)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9781501142970', 8),  -- Horror
('9781501142970', 6),  -- Thriller
('9781501142970', 1);  -- Fiction

-- The Outsiders (Young Adult, Fiction, Drama)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780142407332', 24), -- Young Adult
('9780142407332', 1),  -- Fiction
('9780142407332', 21); -- Drama

-- Charlotte's Web (Children's Literature, Fantasy, Fiction)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780064400558', 25), -- Children's Literature
('9780064400558', 4),  -- Fantasy
('9780064400558', 1);  -- Fiction

-- Matilda (Children's Literature, Fantasy, Fiction)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780142410370', 25), -- Children's Literature
('9780142410370', 4),  -- Fantasy
('9780142410370', 1);  -- Fiction

-- The Little Prince (Children's Literature, Philosophy, Fiction)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780156012195', 25), -- Children's Literature
('9780156012195', 11), -- Philosophy
('9780156012195', 1);  -- Fiction

-- Anne of Green Gables (Children's Literature, Fiction, Classic Literature)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780141321592', 25), -- Children's Literature
('9780141321592', 1),  -- Fiction
('9780141321592', 26); -- Classic Literature

-- Little Women (Fiction, Classic Literature, Young Adult)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780147514004', 1),  -- Fiction
('9780147514004', 26), -- Classic Literature
('9780147514004', 24); -- Young Adult

-- Frankenstein (Horror, Science Fiction, Classic Literature)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780486282114', 8),  -- Horror
('9780486282114', 3),  -- Science Fiction
('9780486282114', 26); -- Classic Literature

-- Dracula (Horror, Classic Literature, Fiction)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780486411095', 8),  -- Horror
('9780486411095', 26), -- Classic Literature
('9780486411095', 1);  -- Fiction

-- The Picture of Dorian Gray (Philosophy, Classic Literature, Fiction)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780141439570', 11), -- Philosophy
('9780141439570', 26), -- Classic Literature
('9780141439570', 1);  -- Fiction

-- The Color Purple (Fiction, Drama, Historical Fiction)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9780156028356', 1),  -- Fiction
('9780156028356', 21), -- Drama
('9780156028356', 28); -- Historical Fiction

-- Beloved (Fiction, Historical Fiction, Drama)
INSERT INTO BookGenre (ISBN, GenreID) VALUES 
('9781400033416', 1),  -- Fiction
('9781400033416', 28), -- Historical Fiction
('9781400033416', 21); -- Drama