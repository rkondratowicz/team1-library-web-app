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

interface CalculateRequestBody {
  expression: string;
  num1: number;
  num2: number;
}

app.post('/api/calculate', (req: Request<{}, {}, CalculateRequestBody>, res: Response) => {
  const { expression, num1, num2 } = req.body;
  let result: number;
  
  if (!expression?.trim()) {
    return res.status(400).json({ error: "Expression is required" });
  }
  if (num1 === undefined || num1 === null) {
    return res.status(400).json({ error: "num1 is required" });
  }
  if (num2 === undefined || num2 === null) {
    return res.status(400).json({ error: "num2 is required" });
  }
  
  try {
    if (expression === "add") {
      result = num1 + num2;
    } else if (expression === "subtract") {
      result = num1 - num2;
    } else if (expression === "multiply") {
      result = num1 * num2;
    } else if (expression === "divide") {
      if (num2 === 0) {
        return res.status(400).json({ error: "Cannot divide by zero" });
      }
      result = num1 / num2;
    } else {
      return res.status(400).json({ error: "Invalid expression" });
    }
    return res.status(200).json({ result });
  } catch (err) {
    return res.status(400).json({ error: "Invalid expression" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});