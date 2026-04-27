# Backend Basics & Express

## Learning Objectives

- Understand the **client-server model** and the request-response cycle
- Know what an **API** is and why it structures backend communication
- Understand **HTTP**: methods, status codes, and message format
- Use **API clients** (Postman / Bruno) to send requests and inspect responses
- Understand what **Express** does and why it exists on top of Node.js
- Create and run an Express server with TypeScript
- Define routes for different HTTP methods and extract data from URLs
- Read request data (params, query strings, body) and send structured responses

---

## Core Concepts

### Client-Server Model

The **frontend** (browser) and the **backend** (server) are separate programs. Communication between them is called the **request-response cycle**:

1. Client sends a request (e.g. form submit)
2. Server processes it (checks credentials, reads DB)
3. Server sends back a response (success or error)
4. Client reacts to the response

An **API** is the contract between client and server — it defines which endpoints exist, what data they expect, and what they return. The client does not need to know how the server works internally.

---

## HTTP

> **HTTP (Hypertext Transfer Protocol)** — the protocol that governs how clients and servers communicate.

### Request structure

| Part | Description |
|------|-------------|
| **Method** | What operation to perform (GET, POST, etc.) |
| **URL** | Which resource to target |
| **Headers** | Metadata (Content-Type, auth tokens, etc.) |
| **Body** | Data sent with POST / PUT / PATCH |

### Response structure

| Part | Description |
|------|-------------|
| **Status code** | Three-digit outcome indicator |
| **Headers** | Metadata about the response |
| **Body** | The actual content returned |

> **HTTP is stateless** — the server remembers nothing between requests. Authentication works by attaching a token (Cookie or JWT) to every request.

---

## HTTP Methods (CRUD)

| Method | Purpose | Has Body? |
|--------|---------|-----------|
| `GET` | Read data — never modifies | No |
| `POST` | Create a new resource | Yes |
| `PUT` | **Replace** a resource entirely | Yes |
| `PATCH` | **Partially update** a resource | Yes |
| `DELETE` | Remove a resource | No |

> **PUT vs PATCH** — PUT means "here is the complete replacement." PATCH means "here are only the fields that changed."

---

## Status Codes

| Range | Meaning |
|-------|---------|
| `2xx` | **Success** |
| `3xx` | Redirection |
| `4xx` | **Client error** (bad request) |
| `5xx` | **Server error** (something broke on the server) |

### Most important codes

| Code | Meaning |
|------|---------|
| `200 OK` | Standard success |
| `201 Created` | New resource created (POST) |
| `204 No Content` | Success, nothing to return (DELETE) |
| `400 Bad Request` | Malformed request or missing data |
| `401 Unauthorized` | Missing or invalid credentials |
| `403 Forbidden` | Authenticated but no permission |
| `404 Not Found` | Resource does not exist |
| `500 Internal Server Error` | Generic server failure |

---

## API Clients (Postman / Bruno)

Used during development to test endpoints without a frontend.

- **Postman** — polished UI, requires an account, cloud sync for collections
- **Bruno** — open-source, offline, stores collections as files in the repo (recommended)

### How to use

1. Select HTTP method
2. Enter URL (e.g. `http://localhost:4730/books`)
3. Add headers or body (JSON) if needed
4. Click **Send** → inspect status code, headers, body

**Collections** group related requests. Treat them as living API documentation.

---

## Express Setup

> Express is a framework on top of Node.js `http`. It handles routing, middleware, and response helpers so you don't have to parse URLs manually.

### Install

```bash
npm install express
npm install --save-dev typescript @types/express @types/node
```

- `express` — runtime dependency
- `typescript` — compiler (dev only)
- `@types/express`, `@types/node` — type declarations (dev only)

### tsconfig.json

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "target": "esnext",
    "module": "esnext",
    "lib": ["esnext", "dom"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "sourceMap": true
  }
}
```

### package.json scripts

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  }
}
```

### Project structure

```
project/
  src/
    index.ts
  dist/          ← gitignored (compiled output)
  node_modules/  ← gitignored
  .gitignore
  package.json
  tsconfig.json
```

### Minimal server

```ts
import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

---

## Routing

Express matches incoming requests by **method + path** and calls the first matching handler.

```ts
app.get("/books", (req, res) => { res.json(books); });
app.post("/books", (req, res) => { /* create */ });
app.put("/books/:id", (req, res) => { /* replace */ });
app.patch("/books/:id", (req, res) => { /* partial update */ });
app.delete("/books/:id", (req, res) => { /* delete */ });
```

### Route parameters

```ts
app.get("/books/:isbn", (req, res) => {
  const isbn = req.params.isbn; // always a string
  const book = books.find((b) => b.isbn === isbn);

  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return; // ← always return after sending a response
  }

  res.json(book);
});
```

### Query strings

```ts
// GET /books?author=Fitzgerald
app.get("/books", (req, res) => {
  const author = req.query.author;
  if (author) {
    return res.json(books.filter((b) => b.author === author));
  }
  res.json(books);
});
```

> **Route parameters** identify a specific resource (`/books/42`).
> **Query strings** are optional modifiers (`/books?author=Fitzgerald`).

### ⚠️ Route order matters

Always register **fixed routes before parameterized ones** — otherwise `/books/featured` is matched as `/books/:id` with `id = "featured"`.

```ts
app.get("/books/featured", ...); // ← first
app.get("/books/:id", ...);      // ← second
```

---

## Request & Response

### Reading request data

| Property | What it contains |
|----------|-----------------|
| `req.params` | Route parameters (`:id`, `:isbn`) — always strings |
| `req.query` | Query string key-value pairs — always strings |
| `req.body` | Parsed request body — **requires middleware** |

### Enabling body parsing

```ts
app.use(express.json()); // must be before route handlers
```

Without this, `req.body` is `undefined`.

### Sending responses

```ts
res.json(data)                  // JSON + Content-Type: application/json
res.send("text")                // plain text
res.status(201).json(newBook)   // status + JSON (chainable)
res.status(204).send()          // no content
```

Express defaults to `200` if you don't call `res.status()`.

### Common patterns

```ts
// Create
app.post("/books", (req, res) => {
  const book = { id: nextId++, ...req.body };
  books.push(book);
  res.status(201).json(book);
});

// Not found
app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return; // ← stop execution
  }
  res.json(book);
});

// Delete
app.delete("/books/:id", (req, res) => {
  books = books.filter((b) => b.id !== Number(req.params.id));
  res.status(204).send();
});
```

> **⚠️ Always `return` after sending a response.** If execution continues and hits another `res.json()`, Express throws: *"Cannot set headers after they are sent to the client."*

---

## BookMonkey Practice API

```bash
npx bookmonkey-api
# Starts at http://localhost:4730
# Docs available at http://localhost:4730
```
