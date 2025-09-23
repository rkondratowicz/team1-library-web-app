import express, { Request, Response } from "express";

const app = express();
const port: number = 3000;

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