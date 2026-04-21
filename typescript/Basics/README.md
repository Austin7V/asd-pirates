# TypeScript Basics

## Learning Objectives

- Explain how TypeScript differs from JavaScript and why static typing matters
- Describe how the TypeScript compiler turns `.ts` files into runnable `.js` files
- Configure a TypeScript project with `tsconfig.json` for predictable builds
- Compile single files and full projects, including watch mode for iteration

> **Challenge:** This session has a code-along challenge. Check the `challenges/` folder — the first challenge accompanies the handout content and can be solved while reading through the session.

---

## Overview

TypeScript adds static typing on top of JavaScript so many type mistakes are caught while writing code, before shipping. It is a **superset** — valid JavaScript is valid TypeScript, but now you can describe the expected shape of data and get compiler feedback when code drifts from that contract.

TypeScript introduces a **build step**: you write `.ts` files, and the TypeScript compiler (`tsc`) transpiles them to plain JavaScript. During this process, type annotations are erased, so there is no runtime cost for using types. The browser or Node.js still runs JavaScript, while TypeScript improves correctness during development.

---

## Compiling TypeScript

The browser and Node.js cannot run `.ts` files directly — they only understand JavaScript. The TypeScript compiler (`tsc`) transforms TypeScript into JavaScript, checks types, reports problems, and creates the output. Type information is erased before runtime, which is why TypeScript gives you stronger feedback without adding runtime overhead.

### Install the compiler

```bash
npm install -g typescript
tsc -v
```

### Three compilation workflows

#### 1. Single-file compilation

```bash
tsc app.ts
node app.js
```

`tsc app.ts` emits `app.js` beside the source file. When passing a file directly, `tsc` **ignores** any `tsconfig.json` — default settings apply. Fine for quick scripts, but use project compilation for anything inside a real project structure.

**Example — what gets erased:**

```ts
// app.ts
const shelterName: string = "Sunflower Commons";
const catCount: number = 7;

function displayShelterInfo(shelterName: string, catCount: number): void {
  console.log(`${shelterName} has ${catCount} cats.`);
}
```

```js
// app.js (emitted)
const shelterName = "Sunflower Commons";
const catCount = 7;

function displayShelterInfo(shelterName, catCount) {
  console.log(`${shelterName} has ${catCount} cats.`);
}
```

Type annotations are stripped entirely.

#### 2. Project compilation

```bash
tsc
```

Running `tsc` without arguments triggers a `tsconfig.json` lookup — searches from the current directory upward. Once found, it reads `include`, `exclude`, and `compilerOptions` to determine what to compile and how.

#### 3. Watch mode

```bash
tsc --watch
# or
tsc -w
```

Keeps the compiler alive and monitors the file system. When a change is detected, it recompiles only what is affected. Type errors are printed inline in the terminal as they appear. **Recommended during active development** — treat it as a continuous background check rather than a manual gate.

---

## Project Setup

### Folder structure

```
project-root/
├── src/        ← TypeScript source files
├── dist/       ← compiled JavaScript output
└── tsconfig.json
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",

    "target": "esnext",
    "module": "NodeNext",
    "lib": ["esnext"],
    "types": [],

    "strict": true,

    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**Key options explained:**

| Option | Effect |
|--------|--------|
| `rootDir` / `outDir` | Enforces clean source-to-build mapping: TypeScript reads from `src`, writes to `dist` |
| `module: NodeNext` | Follows modern Node.js import behavior — imports need explicit file extensions, resolution follows `exports` in `package.json` |
| `lib: ["esnext"]` | Available language features (add `"dom"` for browser APIs) |
| `target: esnext` | Version of the output JavaScript |
| `strict` | Enables checks for implicit `any`, unchecked `null`/`undefined`, unsafe assertions |
| `esModuleInterop` | Makes CommonJS packages work with `import x from "x"` syntax |
| `skipLibCheck` | Skips type-checking `.d.ts` files in `node_modules` — speeds up compilation |
| `resolveJsonModule` | Allows importing `.json` files directly with inferred types |
| `sourceMap` | Generates `.map` files so debuggers and stack traces point to the original TypeScript |

---

## Type Annotations and Aliases

TypeScript's core job is to add type annotations to variables and function definitions. Type aliases (`type` keyword) give a name to a type definition so it can be referenced everywhere instead of repeated, preventing **drift** — where the same shape is defined slightly differently across multiple files.

### Variable annotations

```ts
let shelterName: string = "Sunflower Commons";
let adoptableCats: number = 7;
let hasCommunityGarden: boolean = true;
```

Primitive types: `string`, `number`, `boolean`, `undefined`, `null`. Special types: `never`, `unknown`, `any`.

### Function signatures

```ts
function splitIceCreamCups(totalCups: number, teammates: number): number {
  return totalCups / teammates;
}
```

Explicit input and return types are the most useful TypeScript feature — no more guesswork when reading a function.

### Type aliases

```ts
type VolunteerId = number;
type VolunteerName = string;

type Volunteer = {
  id: VolunteerId;
  name: VolunteerName;
  active: boolean;
};

const member: Volunteer = { id: 12, name: "Nora", active: true };
```

Changing a shared type propagates through the compiler — every usage site that no longer matches is reported.

### Array annotations

```ts
let snackBox: string[] = ["mint tea", "oat cookies", "apple slices"];
let roster: Volunteer[] = [
  { id: 1, name: "Mina", active: true },
  { id: 2, name: "Nora", active: false },
];
```

---

## Type Inference

TypeScript derives a type from the code you already wrote — you do not need to annotate every single value.

### Inferred from initial values

```ts
let teamName = "Sunflower Helpers";    // string
let activeVolunteers = 12;             // number
const hasOpenSlots = true;             // boolean
let catNames = ["Milo", "Nora", "Pico"]; // string[]
```

### Inferred function return type

```ts
function formatVolunteerBadge(id: number) {
  return `VOL-${id}`; // return type inferred as string
}
```

### Inferred in callbacks

```ts
const healthPoints = [12, 18, 25];
const boosted = healthPoints.map((hp) => hp + 5);
// hp: number, boosted: number[]
```

### When inference needs help

```ts
let nextShiftStart: number; // uninitialized — must annotate

function assignPartner(name: string, partnerId: number) { // parameters — must annotate
  return `${name}-${partnerId}`;
}
```

**Practical default:**
- Rely on inference for obvious local values and short callback logic
- Use explicit annotations for function parameters and return types
- Annotate exported objects and shared data structures across files

---

## Interfaces

Interfaces make object contracts explicit — TypeScript checks every usage point against the declared structure.

### Defining an object contract

```ts
interface Volunteer {
  id: number;
  name: string;
  active: boolean;
}

const member: Volunteer = { id: 12, name: "Nora", active: true };
```

### Optional and readonly properties

```ts
interface CourseConfig {
  title: string;
  durationWeeks: number;
  location?: string;       // optional
  readonly cohortCode: string; // cannot be reassigned after creation
}
```

### Methods in interfaces

```ts
interface ProgressTracker {
  complete(topic: string): void;
  getCompletedCount(): number;
}
```

### Extending interfaces

```ts
interface Person {
  id: number;
  name: string;
}

interface Coach extends Person {
  specialty: string; // inherits id and name, adds specialty
}
```

### `interface` vs `type`

| Use `interface` | Use `type` |
|-----------------|------------|
| Object shapes shared between large portions of the app | Unions, intersections, tuples |
| Classes that implement with `implements` | Aliases for primitives |
| Models extended with `extends` | Compositions interfaces cannot express |
| When declaration merging is needed | |

---

## ES Modules

In a `NodeNext` setup, each file controls what it shares — anything not exported is private to that file.

### Exporting

```ts
// volunteer.ts
export interface Volunteer {
  id: number;
  name: string;
}

export function formatVolunteer(name: string): string {
  return name.trim().toUpperCase();
}
```

### Importing — use `import type` for type-only references

```ts
import { formatVolunteer } from "./volunteer.js";
import type { Volunteer } from "./volunteer.js";

const lead: Volunteer = { id: 1, name: "Mina" };
console.log(formatVolunteer(lead.name));
```

`formatVolunteer` stays in emitted JavaScript. `Volunteer` is erased during compilation.

### Re-exporting from an index file

```ts
// index.ts
export { formatVolunteer } from "./volunteer.js";
export type { Volunteer } from "./volunteer.js";
```

Reduces repetitive deep relative imports as the project grows.

### Common mistakes

**1. Not using `import type` for type-only imports**

```ts
// Both end up in emitted JS, even if formatVolunteer is never called
import { Volunteer, formatVolunteer } from "./volunteer.js"; // ❌

import { formatVolunteer } from "./volunteer.js";            // ✅
import type { Volunteer } from "./volunteer.js";             // ✅
```

**2. Missing `.js` extension in NodeNext projects**

```ts
import { formatVolunteer } from "./volunteer";    // ❌ fails at runtime
import { formatVolunteer } from "./volunteer.js"; // ✅
```

TypeScript compiles `.ts` to `.js`. At runtime, Node.js looks for `.js` — the extension must match.

**3. Duplicating type definitions across files**

```ts
// volunteers.ts
interface Volunteer { id: number; name: string; }

// reports.ts
interface Volunteer { id: number; name: string; } // ❌ will drift
```

Define the type once and import it everywhere:

```ts
import type { Volunteer } from "./volunteer.js"; // ✅
```
