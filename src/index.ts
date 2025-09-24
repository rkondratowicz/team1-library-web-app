import path from "node:path";
import express, { type Request, type Response } from "express";
import sqlite3 from "sqlite3";

const app = express();
const port: number = 3000;
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(express.static(path.join(process.cwd(), "public")));

const dbPath = path.join(process.cwd(), "Library.db");
const db = new sqlite3.Database(dbPath);
interface Book {
  BookID: number;
  title: string;
  author: string;
}

// Endpoint to view all books in the database
app.get("/api/books", (_req: Request, res: Response) => {
  db.all("SELECT * FROM books", (err: Error | null, rows: Book[]) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get("/api/getBook/:title", (req: Request, res: Response) => {
  const title: string = req.params.title;
  db.get(
    "SELECT * FROM books WHERE title=?",
    [title],
    (_err: Error | null, row: Book | undefined) => {
      if (!row) {
        res.status(404).send("Book not found");
        console.log("book not found");
        return;
      }
      res.json({ id: row.BookID, title: row.title, author: row.author });
    }
  );
});

app.get("/", (_req: Request, res: Response) => {
  res.render("index", { title: "Library Home" });
});

interface GreetRequestBody {
  name: string;
}

app.post(
  "/api/greet",
  (req: Request<Record<string, never>, Record<string, never>, GreetRequestBody>, res: Response) => {
    const name = req.body.name;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    res.status(200).send(`Hello, ${name}!`);
  }
);

interface GreetQuery {
  name: string;
}

app.get(
  "/api/greet2",
  (
    req: Request<Record<string, never>, Record<string, never>, Record<string, never>, GreetQuery>,
    res: Response
  ) => {
    const name = req.query.name;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    res.status(200).send(`Hello, ${name}!`);
  }
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
