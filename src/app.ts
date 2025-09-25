import path from "node:path";
import express from "express";
import { BookController } from "./controllers/BookController.js";
import { setupMiddleware } from "./middleware/index.js";
import { BookRepository } from "./repositories/BookRepository.js";
import { createBookRoutes } from "./routes/BookRoutes.js";
import { createGreetRoutes } from "./routes/GreetRoutes.js";
import { BookService } from "./services/BookService.js";

const app = express();

const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupMiddleware(app);

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(express.static(path.join(process.cwd(), "public")));

const bookRepository = new BookRepository();
const bookService = new BookService(bookRepository);
const bookController = new BookController(bookService);

app.use("/api", createBookRoutes(bookController));
app.use("/api", createGreetRoutes());

app.get("/", (_req, res) => {
  res.render("index", { title: "Library Home" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
