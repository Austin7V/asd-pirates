# TypeScript Advanced — Intro

## Learning Objectives

- Combine multiple types using intersection types and define fixed-shape arrays with tuple types
- Write generic functions and interfaces that work with any data type while keeping full type safety
- Use built-in utility types to derive specialized types from a single base definition
- Organize type declarations in `.d.ts` files to separate type contracts from runtime code

---

## Overview

The fundamentals covered type annotations, aliases, unions, and interfaces — enough for a small project. As a codebase grows, patterns repeat: API responses always share the same wrapper, database entities have auto-generated fields that should not appear in creation requests, search results only need a subset of fields. Writing a separate interface for every variation leads to duplicated definitions that drift apart when the base type changes.

This session introduces four tools that solve these problems:

| Tool | Purpose |
|------|---------|
| Intersection types | Compose complex types from smaller reusable pieces |
| Tuples | Arrays where each position has a known type |
| Generics | One interface or function that adapts to any type |
| Utility types | Built-in generics that transform existing types |

---

## Intersection Types and Tuples

### Intersection Types

The `&` operator combines two or more types into one. The resulting type must satisfy **all** combined types — think "this AND that."

```ts
type HasId = { id: string };
type Timestamped = { createdAt: Date; updatedAt: Date };

type BookFields = {
  title: string;
  author: string;
  isbn: string;
  isAvailable: boolean;
};

type Book = HasId & Timestamped & BookFields;
```

A value of type `Book` must include every property from all three types. If you later add a `deletedAt` field to `Timestamped`, every type that uses it picks it up automatically.

> **Note:** Intersection types are the standard way to extend a `type` alias. Interfaces use `extends` for the same purpose, but `type` cannot use `extends`. Use `&` when working with type aliases.

### Intersection vs Union

```ts
type StringOrNumber = string | number;   // either one
type HasNameAndAge = { name: string } & { age: number };  // both required
```

> **Watch out:** Intersecting incompatible primitives produces `never`. `string & number` resolves to `never` because no value can be both at the same time.

### Tuple Types

A tuple is an array with a fixed length where each position has its own type.

```ts
type IsbnParts = [number, string, string];
const cleanCodeIsbn: IsbnParts = [978, "0132", "350884"];
```

TypeScript enforces both the length and the type at each position. Destructuring gives each variable the correct type automatically:

```ts
const [group, publisher, titleCode] = cleanCodeIsbn;
// group: number, publisher: string, titleCode: string
```

Tuples work well for small positional data and function return values:

```ts
type BookResult = [Book | null, Error | null];
function findBook(id: number): BookResult { ... }
```

For four or more fields, prefer named objects — positional data becomes confusing at scale.

> **Good to know:** `useState` in React returns a tuple. `const [count, setCount] = useState(0)` is typed as `[number, Dispatch<SetStateAction<number>>]`.

### The `keyof` Operator

`keyof` extracts all property keys of an object type as a union of string literals:

```ts
type GenreDescriptions = {
  horror: string;
  romance: string;
  scienceFiction: string;
};

function getGenreDescription(genre: keyof GenreDescriptions): string {
  return descriptions[genre];
}

getGenreDescription("horror");    // OK
getGenreDescription("fantasy");   // Compile error
```

The allowed values stay automatically in sync if `GenreDescriptions` ever changes.

---

## Generics

### Generic Interfaces

A type variable (usually `T`) acts as a placeholder filled in at the point of use:

```ts
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

const bookList: ApiResponse<Book[]> = {
  status: 200,
  message: "Books fetched",
  data: [{ id: 1, title: "Clean Code", author: "Robert C. Martin" }],
};

const error: ApiResponse<ApiError> = {
  status: 404,
  message: "Not found",
  data: { code: "NOT_FOUND", detail: "No book with that ID" },
};
```

One definition covers all response shapes.

### Built-in Generic Types

| Type | Description |
|------|-------------|
| `Array<T>` | Same as `T[]` — shows up in library signatures |
| `Promise<T>` | Every `async` function returns one |
| `ReadonlyArray<T>` | Array where elements cannot be added, removed, or reassigned |

### Generic Functions

Without generics, type information is lost:

```ts
function getFirst(items: unknown[]): unknown { return items[0]; }
```

With a type variable, the return type matches the input:

```ts
function getFirst<T>(items: T[]): T { return items[0]; }

const title = getFirst(["Clean Code", "Refactoring"]); // string
const id = getFirst([1, 2, 3]);                         // number
```

### Generic Constraints

`extends` limits which types a variable accepts:

```ts
function getEntityId<T extends { id: number | string }>(entity: T): number | string {
  return entity.id;
}

getEntityId({ id: 1, title: "Clean Code" });  // OK
getEntityId({ name: "no id here" });          // Compile error
```

### Multiple Type Parameters

```ts
function createEntry<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}
```

### Default Type Parameters

```ts
interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
}

const raw: ApiResponse = { status: 200, message: "OK", data: null };
// data is unknown

const typed: ApiResponse<Book> = { status: 200, message: "OK", data: book };
// data is Book
```

---

## Utility Types

Built-in generics that transform existing types. They prevent duplicated definitions that drift apart.

### `Partial<T>` and `Required<T>`

```ts
type BookUpdate = Partial<Book>;
// Every property becomes optional — useful for PATCH endpoints

function updateBook(id: number, changes: Partial<Book>): void { ... }
```

```ts
type ResolvedConfig = Required<AppConfig>;
// Every optional property becomes required
```

### `Readonly<T>`

```ts
type FrozenBook = Readonly<Book>;

const book: FrozenBook = { ... };
book.title = "New Title";  // Compile error
```

> **Good to know:** `Readonly<T>` is the type-level equivalent of `Object.freeze()`. One prevents changes at compile time, the other at runtime.

### `Pick<T, K>` and `Omit<T, K>`

```ts
// Select specific properties
type BookPreview = Pick<Book, "id" | "title" | "author">;

// Remove specific properties
type BookCreatePayload = Omit<Book, "id" | "createdAt" | "updatedAt">;
```

> **Watch out:** Keys in `K` must actually exist in `T`. A misspelled key causes a compile error — this catches typos before production.

### `Record<K, T>`

Creates an object type where every key is `K` and every value is `T`:

```ts
type ShelfCounts = Record<"fiction" | "non-fiction" | "technical", number>;

const counts: ShelfCounts = {
  fiction: 120,
  "non-fiction": 85,
  technical: 200,
};
// Omitting any key is a compile error
```

### Composing Utility Types

```ts
// PATCH payload: exclude server fields, make the rest optional
type BookUpdatePayload = Partial<Omit<Book, "id" | "createdAt" | "updatedAt">>;
```

Full type layer derived from one `Book` interface:

```ts
type BookCreatePayload = Omit<Book, "id" | "createdAt" | "updatedAt">;
type BookUpdatePayload = Partial<Omit<Book, "id" | "createdAt" | "updatedAt">>;
type BookPreview = Pick<Book, "id" | "title" | "author">;
```

When `Book` gains a new field, `Create` and `Update` automatically reflect it.

---

## Declaration Files (`.d.ts`)

A `.d.ts` file contains only type information — no runtime code, no function bodies. The compiler uses it for type checking and strips it entirely during compilation: zero bytes in production JS.

### Internal project types

```ts
// types/book.d.ts
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

```ts
// src/bookService.ts
import type { Book, BookCreatePayload, ApiResponse } from "../types/book";
```

`import type` tells the compiler and bundler this is type-only — the compiled JS will not contain it.

### External library declarations

The `declare` keyword describes runtime code that exists but was not written in TypeScript:

```ts
// Inside @types/node (simplified)
declare var process: {
  env: Record<string, string | undefined>;
  exit(code?: number): never;
  cwd(): string;
};
```

> **Watch out:** Use regular `export` for your own project types. The `declare` keyword is only for describing external runtime code. Mixing them up causes confusing compiler errors.

---

## Type Packages (`@types/*`)

Many JavaScript libraries do not ship built-in type declarations. The `@types` namespace (DefinitelyTyped) provides `.d.ts` files for them.

```bash
npm install lodash
npm install --save-dev @types/lodash

npm install --save-dev @types/node
```

- The main package is the runtime library.
- `@types/*` adds compile-time type information only — no runtime code.

### Rule of thumb

1. Install the main package first.
2. If it already ships its own declarations, no `@types/*` is needed.
3. If declarations are missing, install the matching `@types/*` as a dev dependency.

### Scoping type environments in `tsconfig.json`

```json
{
  "compilerOptions": {
    "types": ["node"]
  }
}
```

Controls which ambient declaration packages are loaded — useful when browser and Node code coexist.

### Resolving missing declaration errors

- Check whether the library ships built-in types before installing `@types/*`.
- If not, install the matching `@types` package as a dev dependency.
- If versions drift, align runtime and type package major versions.
- Avoid defaulting to `any` — treat missing declarations as a configuration issue to fix.
