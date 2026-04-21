# TypeScript Client-Side

## Learning Objectives

- Understand why Node.js cannot access the DOM and what to use instead
- Configure `tsconfig.json` for a browser environment
- Use type assertion to work with the generic types returned by DOM methods
- Type event objects and event targets in DOM event listeners
- Apply interfaces and type assertion when fetching data from an API

---

## Overview

Browser APIs were not written with TypeScript in mind. `document.getElementById()` returns `HTMLElement | null` because TypeScript cannot know at compile time whether the element is an input, a button, or a div. The same goes for event handlers (generic `Event`) and the Fetch API (`response.json()` returns untyped data).

This session covers techniques to safely handle these boundaries — explicitly providing the missing context when TypeScript's inference is too broad or cannot know the exact shape of data at runtime.

---

## Server vs. Client

Node.js and the browser are different JavaScript runtime environments. Both execute JavaScript, but each exposes different globals:

| Environment | Available globals |
|-------------|-------------------|
| Node.js | `process`, `Buffer`, file system module |
| Browser | `window`, `document`, `localStorage` |

Node.js has no DOM. Code that calls `document.getElementById()` or reads from `window` relies on objects the browser creates when parsing an HTML page — those objects do not exist in Node.js. Even if the TypeScript compiler does not catch it, the code will throw a `ReferenceError` at runtime.

**For browser code:** compile TypeScript into JavaScript with `tsc` and load the resulting file in an HTML page via a `<script type="module">` tag.

### tsconfig.json for browser environments

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "lib": ["dom", "esnext"]
  }
}
```

| Option | Effect |
|--------|--------|
| `lib: ["dom"]` | Includes all browser API types — `document`, `window`, `HTMLElement`, and other browser globals. Without it, TypeScript does not know those globals exist |
| `target: "ESNext"` | Preserves modern syntax like `async/await` without down-compiling |
| `module: "ESNext"` | Produces `import`/`export` statements, which browsers understand natively |

> Add `type="module"` to your `<script>` tag so the browser handles `import`/`export` statements correctly.

---

## Typing DOM Elements

`document.getElementById("username-input")` returns `HTMLElement | null` — TypeScript cannot know at compile time which element has that ID. The issue: `HTMLElement` only includes properties common to all elements. It does not have `.value` (inputs) or `.src` (images). Reading those causes a compiler error.

### Type assertions

Type assertion lets you tell the compiler which specific type a value actually is, using the `as` keyword. This is **compile-time only** — no runtime check happens.

```ts
let myValue: unknown = "Hello, TypeScript!";
let strLength: number = (myValue as string).length;
```

The parentheses ensure the assertion applies to the value before the property access.

### DOM element types

Each HTML element has a corresponding TypeScript interface:

```ts
const inputElement = document.getElementById("username-input") as HTMLInputElement;

inputElement.value;       // ✅ available
inputElement.disabled;    // ✅ available
inputElement.placeholder; // ✅ available
```

Without the assertion, accessing `.value` causes a compiler error — that property does not exist on the base `HTMLElement` type.

### Common element types and their key properties

| Type | Key properties |
|------|---------------|
| `HTMLInputElement` | `.value`, `.disabled`, `.type`, `.placeholder` |
| `HTMLButtonElement` | `.disabled`, `.textContent`, `.innerHTML` |
| `HTMLImageElement` | `.src`, `.alt`, `.width`, `.height` |
| `HTMLDivElement` | `.innerHTML`, `.textContent`, `.style` |
| `HTMLSelectElement` | `.value`, `.selectedIndex`, `.options` |
| `HTMLTextAreaElement` | `.value`, `.disabled`, `.placeholder` |

---

## Event Handlers

TypeScript types the event object as the generic `Event` interface — it does not carry mouse-specific properties like `clientX` or keyboard-specific properties like `key`. Accessing those without narrowing the type causes a compiler error.

**Fix:** annotate the event parameter with the correct, specific event interface.

### Event types

```ts
const button = document.getElementById("my-button") as HTMLButtonElement;

button.addEventListener("click", (event: MouseEvent) => {
  console.log(event.clientX); // ✅
});

document.addEventListener("keydown", (event: KeyboardEvent) => {
  console.log(event.key); // ✅
});
```

**Common event interfaces:**

| Interface | Triggered by |
|-----------|-------------|
| `MouseEvent` | clicks, mouse movement, drag |
| `KeyboardEvent` | `keydown`, `keyup`, `keypress` |
| `InputEvent` | input element value changes |
| `SubmitEvent` | form submission |
| `FocusEvent` | `focus` and `blur` |

### Typed event targets

Inside a handler, `event.target` is typed as `EventTarget` — the most general DOM interface, with almost no element-specific properties. Use type assertion to narrow it:

```ts
const input = document.getElementById("user-input") as HTMLInputElement;

input.addEventListener("input", (event: Event) => {
  const inputElement = event.target as HTMLInputElement;
  console.log(inputElement.value); // ✅
});
```

This is compile-time only. If `event.target` is not actually an input at runtime, the error will be silent.

### `this` in handlers

In regular function expressions (not arrow functions), `this` refers to the element the listener is attached to. If you need TypeScript to recognize it as a specific element type, annotate it as the first parameter — TypeScript strips it at compile time:

```ts
const container = document.getElementById("container");

container.addEventListener("click", function (this: HTMLDivElement, event: MouseEvent) {
  console.log(this.offsetWidth); // ✅
});
```

This pattern is uncommon in modern code. Arrow functions handle most cases without needing explicit `this` annotations.

---

## Fetch API

`response.json()` returns `any` — TypeScript cannot infer the shape of data fetched over the network at runtime. Without additional type information, every property you access is untyped, and typos or structural mismatches become **silent runtime bugs**.

### Defining data shapes

Define an interface that matches the JSON structure you expect:

```ts
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}
```

This is a **compile-time contract**. TypeScript uses it to validate property access — it does not validate the actual network response at runtime. If the API returns something different, TypeScript will not catch it.

### Typing async functions

An `async` function always wraps its return value in a `Promise`. Use `Promise<Type>` to annotate the return type, and `as` to assert the parsed JSON:

```ts
async function fetchAllUsers(url: string): Promise<User[]> {
  const response = await fetch(url);
  const data = await response.json();

  return data as User[];
}
```

- `Promise<User[]>` — declares the exact shape the function will eventually produce
- `data as User[]` — asserts the parsed JSON as the expected shape so TypeScript can type-check all downstream usage

### Using the result

```ts
const users = await fetchAllUsers("https://jsonplaceholder.typicode.com/users");

console.log(users[0].name); // ✅ exists on User
console.log(users[0].age);  // ❌ compiler error — no 'age' property on User
```

Once TypeScript knows the type, it catches misspelled fields and non-existent properties at compile time rather than at runtime.
