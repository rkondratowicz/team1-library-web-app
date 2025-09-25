import path from "node:path";
import express from "express";
import { BookController } from "./controllers/BookController.js";
import { MemberController } from "./controllers/memberController.js";
import { setupMiddleware } from "./middleware/index.js";
import { BookRepository } from "./repositories/BookRepository.js";
import { MemberRepository } from "./repositories/memberRepository.js";
import { createBookRoutes } from "./routes/BookRoutes.js";
import { createGreetRoutes } from "./routes/GreetRoutes.js";
import { createMemberRoutes } from "./routes/memberRoutes.js";
import { BookService } from "./services/BookService.js";
import { MemberService } from "./services/memberService.js";

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

const _memberRepository = new MemberRepository();
const _memberService = new MemberService();
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
  res.send(`
    <html>
      <head>
        <title>Borrowing - Coming Soon</title>
        <link href="/output.css" rel="stylesheet">
      </head>
      <body class="min-h-screen bg-base-100 flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-4">Borrowing Management</h1>
          <p class="text-xl mb-4">Coming Soon!</p>
          <a href="/" class="btn btn-primary">Return Home</a>
        </div>
      </body>
    </html>
  `);
});

app.get("/reports", (_req, res) => {
  res.send(`
    <html>
      <head>
        <title>Reports - Coming Soon</title>
        <link href="/output.css" rel="stylesheet">
      </head>
      <body class="min-h-screen bg-base-100 flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-4">Reports & Analytics</h1>
          <p class="text-xl mb-4">Coming Soon!</p>
          <a href="/" class="btn btn-primary">Return Home</a>
        </div>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
