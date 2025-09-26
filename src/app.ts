import path from "node:path";
import express from "express";
import { AnalyticsController } from "./controllers/AnalyticsController.js";
import { BookController } from "./controllers/BookController.js";
import { MemberController } from "./controllers/memberController.js";
import { setupMiddleware } from "./middleware/index.js";
import { BookRepository } from "./repositories/BookRepository.js";
import { createAnalyticsRoutes } from "./routes/AnalyticsRoutes.js";
import { createBookRoutes } from "./routes/BookRoutes.js";
import { createGreetRoutes } from "./routes/GreetRoutes.js";
import { createMemberRoutes } from "./routes/memberRoutes.js";
import { AnalyticsService } from "./services/AnalyticsService.js";
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

// Analytics components
const analyticsService = new AnalyticsService();
const analyticsController = new AnalyticsController();

app.use("/api", createBookRoutes(bookController));
app.use("/api", createMemberRoutes(memberController));
app.use("/api", createAnalyticsRoutes(analyticsController));
app.use("/api", createGreetRoutes());

app.get("/", async (_req, res) => {
  try {
    const stats = await analyticsService.getLibraryStats();
    res.render("index", {
      title: "Library Home",
      stats: stats,
    });
  } catch (error) {
    console.error("Error fetching analytics for home page:", error);
    // Render with default stats if there's an error
    res.render("index", {
      title: "Library Home",
      stats: {
        totalBooks: 0,
        totalMembers: 0,
        booksCurrentlyBorrowed: 0,
        availableBooks: 0,
      },
    });
  }
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
