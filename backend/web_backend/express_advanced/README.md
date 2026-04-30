# Backend Express Advanced

## Learning Objectives

- Write Express middleware and understand how it fits in the request-response cycle
- Build an access logger that captures method, URL, IP, timestamp, and status code
- Append log entries to a file using Node.js `fs/promises`
- Build stable file paths with `path.join()` and a startup existence check
- Read configuration from `process.env` and manage `.env` files safely
- Debug with `console.log()` and the Node.js inspector

---

## Middleware

Middleware is a function that runs between the incoming request and the route handler.  
Every `app.use()` call adds one to the chain. They execute in registration order.

```ts
import type { NextFunction, Request, Response } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.url}`);
  next(); // must call next() or the request hangs
}
```

A middleware must do exactly one of two things:
- call `next()` to pass control forward, or
- send a response with `res.json()` / `res.send()` to end the cycle.

**Never do both.** Sending a response and then calling `next()` causes errors.

### Order matters

```ts
// req.body is undefined here — middleware not registered yet
app.post("/early", (req, res) => res.json({ received: req.body }));

app.use(express.json()); // parse JSON bodies

// req.body is available here
app.post("/late", (req, res) => res.json({ received: req.body }));
```

---

## Access Logger

An access log gives you a record of every request. Useful when a route returns the
wrong status, a page fails to load, or a user reports "it doesn't work."

**Log after the response finishes** so you can capture the final status code:

```ts
export function logger(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    const entry = [
      new Date().toISOString(), // always UTC, always sortable
      req.method,
      req.ip,
      req.originalUrl,
      res.statusCode,
    ].join(" ");

    console.log(entry);
  });

  next();
}
```

`res.on("finish", ...)` fires after the response is written completely.  
Logging too early can miss the final status code.

---

## File System Operations

### Building paths — prefer `path.join()`

```ts
import path from "node:path";

const LOG_DIR  = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "logs.txt");
```

`process.cwd()` — directory the Node process was started from (usually project root).  
`__dirname`     — directory of the compiled JS file (works regardless of cwd, but needs `../..` navigation from inside `dist/`).

### Ensure the file exists at startup

```ts
import { access, constants, writeFile } from "node:fs/promises";

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

async function ensureLogFile(filePath: string): Promise<void> {
  if (!(await fileExists(filePath))) {
    await writeFile(filePath, "", { encoding: "utf-8" });
  }
}
```

### Append one line per request

```ts
import { appendFile } from "node:fs/promises";

async function addLogMessage(message: string): Promise<void> {
  await appendFile(LOG_FILE, message + "\n", { encoding: "utf-8" });
}
```

Use `appendFile`, not `writeFile` — `writeFile` overwrites the whole file.

### Startup order

```ts
await ensureLogFile(LOG_FILE); // 1. prepare file
app.use(logger);               // 2. register middleware
app.listen(port, ...);         // 3. accept requests
```

---

## Express Router

`express.Router()` creates a self-contained routing object — a mini Express app.  
Mount it on the main app with a prefix; routes inside use relative paths.

```ts
// routes/books.ts
import { Router } from "express";
const router = Router();

router.get("/", (req, res) => res.json(books));     // handles GET /books
router.post("/", (req, res) => { ... });             // handles POST /books

export default router;
```

```ts
// index.ts
import booksRouter from "./routes/books";
app.use("/books", booksRouter);
```

### Public vs protected routes

Registering `authenticate` with `router.use()` protects all routes below it.
Routes above it remain public.

```ts
// public read
router.get("/", (req, res) => res.json(books));

router.use(authenticate); // everything below requires auth

// private write
router.post("/", (req, res) => { ... });
router.delete("/:id", (req, res) => { ... });
```

---

## Environment Variables

Keep configuration out of source code — read it at runtime from `process.env`.

```ts
const port = Number(process.env.PORT) || 3000;
app.listen(port);
```

### Loading `.env` locally

**Node 20.6+ (preferred):**
```json
{ "scripts": { "dev": "tsx watch --env-file=.env src/index.ts" } }
```

**Older setups — `dotenv`:**
```ts
import "dotenv/config"; // must be first import
import express from "express";
```

### Keep secrets out of Git

```gitignore
# .gitignore
.env
```

Commit `.env.example` with placeholder values instead:
```
PORT=3000
API_KEY=
DATABASE_URL=
```

> If you accidentally commit a real `.env`, adding it to `.gitignore` is not enough —
> the secrets are already in Git history. Rotate all exposed credentials immediately.

---

## Debugging

### Quick: `console.log()`

```ts
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log("logger ran for", req.method, req.originalUrl);
  next();
}
```

Useful questions to answer fast:
- Is the middleware running at all?
- What does `req.originalUrl` actually contain?
- What path did `path.join()` produce?
- Did the `catch` block run?

### Deeper: Node.js inspector

```bash
node --inspect dist/index.js
```

Lets you set breakpoints, inspect `req`/`res`, and step through async file operations.

### VS Code launch config

```json
{
  "version": "0.2.0",
  "configurations": [{
    "type": "node",
    "request": "launch",
    "name": "Debug Express App",
    "program": "${workspaceFolder}/dist/index.js",
    "skipFiles": ["<node_internals>/**"]
  }]
}
```

### Never swallow errors silently

```ts
// bad — failures disappear
try {
  await appendFile(LOG_FILE, entry);
} catch {}

// good — failures stay visible
try {
  await appendFile(LOG_FILE, entry);
} catch (err) {
  console.error("Logger failed to write:", err);
}
```

---

## Key Rules to Remember

| Rule | Why |
|------|-----|
| Register middleware before the routes that need it | Order is execution order |
| Always call `next()` or send a response, never both | Prevents hanging requests and double-response errors |
| Use `appendFile`, not `writeFile` for logs | `writeFile` overwrites; `appendFile` accumulates |
| Ensure the log file exists before requests start | First request should not create the file as a side effect |
| Never commit `.env` | Secrets in Git history are permanently exposed |
| Never leave empty `catch` blocks | Silent failures make debugging impossible |
