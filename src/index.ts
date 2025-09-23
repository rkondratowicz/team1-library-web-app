import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";
import path from "path";


const app = express();
const port: number = 3000;

const dbPath = path.join(process.cwd(), "Library.db");
const db = new sqlite3.Database(dbPath);
// Endpoint to view all books in the database
app.get("/api/books", (req: Request, res: Response) => {
  db.all("SELECT * FROM books", (err: Error | null, rows: any[]) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello, World!" });
});

interface GreetRequestBody {
  name: string;
}

app.post("/api/greet", (req: Request<{}, {}, GreetRequestBody>, res: Response) => {
  const name = req.body.name;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  res.status(200).send(`Hello, ${name}!`);
});

interface GreetQuery {
  name: string;
}

app.get("/api/greet2", (req: Request<{}, {}, {}, GreetQuery>, res: Response) => {
  const name = req.query.name;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  res.status(200).send(`Hello, ${name}!`);
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});