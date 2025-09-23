const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});
app.post("/api/greet", (req, res) => {
  const name = req.body.name;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  res.status(200).send(`Hello, ${name}!`);
});
app.get("/api/greet2", (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  res.status(200).send(`Hello, ${name}!`);
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
