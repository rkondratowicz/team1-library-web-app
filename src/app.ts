import path from "node:path";
import express from "express";
import { BookController } from "./controllers/BookController.js";
import { MemberController } from "./controllers/memberController.js";
import { setupMiddleware } from "./middleware/index.js";
import { BookRepository } from "./repositories/BookRepository.js";
import { createBookRoutes } from "./routes/BookRoutes.js";
import { createGreetRoutes } from "./routes/GreetRoutes.js";
import { createMemberRoutes } from "./routes/memberRoutes.js";
import { BookService } from "./services/BookService.js";

const app = express();

const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupMiddleware(app);

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(express.static(path.join(process.cwd(), "public")));

const _bookRepository = new BookRepository();
const bookService = new BookService();
const bookController = new BookController();

// const _memberRepository = new MemberRepository();
// const _memberService = new MemberService();
const memberController = new MemberController();

app.use("/api", createBookRoutes(bookController));
app.use("/api", createMemberRoutes(memberController));
app.use("/api", createGreetRoutes());

app.get("/", (_req, res) => {
  res.render("index", { title: "Library Home" });
});

app.get("/books", async (_req, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.render("books", { title: "Books Management", books: books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.render("books", { title: "Books Management", books: [] });
  }
});

app.get("/members", (_req, res) => {
  res.render("members", { title: "Members Management" });
});

app.get("/borrowing", (_req, res) => {
  res.render("borrowing", { title: "Book Borrowing Management" });
});

app.get("/analytics", (_req, res) => {
  res.render("analytics", { title: "Library Analytics" });
});

app.get("/reports", (_req, res) => {
  res.redirect("/analytics");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
