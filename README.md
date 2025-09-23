# team1-library-web-app

A small TypeScript + Express web app template for Team 1's library project. This repository contains a minimal server entrypoint (`src/index.ts`), TypeScript configuration, and a SQL migration folder for creating the `books` table.

This README explains how to set up the project locally, run the app, apply migrations, and run a quick type-check. It also documents the project's structure and useful development notes.

## Requirements

- Node.js 18+ (or compatible LTS)
- npm (or yarn/pnpm)
- A SQL database for migrations (e.g. PostgreSQL, MySQL, or SQLite). The migration files are plain SQL and need to be run with your chosen database client.

## Quick start

1. Install dependencies

```bash
npm install
```

2. Build (type check) and run the app in development

```bash
# Type-check only (no emit required for quick checks)
npx tsc --noEmit

# Start with ts-node (if you prefer) or run the compiled JS after tsc build
npm run dev
```

Note: This project includes `tsconfig.json`. Adjust scripts in `package.json` if you prefer different start/build workflows.

## Migrations

SQL migration files live in the `Migrations/` directory. For example, `Migrations/001_creat_books_table.sql` contains the SQL needed to create the `books` table used by the app.

To apply migrations, run the SQL against your database using your preferred client or migration tool. Example using `psql` for PostgreSQL:

```bash
# from project root, replace placeholders
psql "postgres://USER:PASS@HOST:PORT/DBNAME" -f Migrations/001_creat_books_table.sql
```

If you plan to use a migration tool (e.g. Knex, TypeORM, Flyway), consider adapting the SQL files into that tool's format.

## Project structure

- `src/` - TypeScript source files
  - `index.ts` - server entrypoint
- `Migrations/` - SQL migration files
- `package.json` - npm scripts and dependencies
- `tsconfig.json` - TypeScript configuration

Open `src/index.ts` to see how the server is started and where to add routes and middleware.

## Scripts

Common scripts you can add or adapt in `package.json`:

- `npm run dev` - start the server in development (e.g. using `ts-node-dev` or `nodemon` + `ts-node`)
- `npm run build` - compile TypeScript to JavaScript
- `npm test` - run tests (if added)

If these scripts aren't present, add the ones you prefer (the project currently ships with a minimal `package.json`).

## Tests

There are no tests included by default. We recommend adding a test framework such as Jest or Vitest for unit and integration tests. Example quick setup using Jest:

```bash
npm install -D jest ts-jest @types/jest
npx ts-jest config:init
```

## Contribution

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Implement changes and add tests
4. Run `npx tsc --noEmit` and your tests locally
5. Open a pull request describing your changes

## Notes & assumptions

- This README assumes you'll run the SQL migrations manually or integrate them into a migration tool. No specific database client or ORM is included by default.
- The `README.md` also assumes `npm` is the package manager. If you use `yarn` or `pnpm`, adapt commands accordingly.

## Useful commands summary

```bash
npm install
npm build
npm run dev
```
---

