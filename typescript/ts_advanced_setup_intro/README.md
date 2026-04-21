# TypeScript Advanced Setup — Intro

## Learning Objectives

- Understand additional `tsconfig` options that enforce coding rules
- Understand what `nodemon` does and how it fits into a Node.js dev workflow
- Set up `tsx watch` as a single-tool replacement for `tsc + nodemon`
- Use `concurrently` to run multiple long-running processes from one script
- Know when to combine `nodemon` with `tsx` for advanced file watching

---

## Overview

Node.js (versions < 25.9) can only run JavaScript. TypeScript must be compiled first, so every TypeScript project needs a build step before it can run. During development, that step must re-run on every save, and the server must restart to pick up the changes.

This session covers the tools that automate that cycle and how they relate to each other.

---

## Extended tsconfig — Coding Rules

A `tsconfig.json` can do more than control compilation output. You can add rules that enforce consistent coding standards across the team.

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",

    "target": "esnext",
    "lib": ["esnext"],
    "types": [],
    "module": "esnext",

    "esModuleInterop": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "skipLibCheck": true,

    // coding rules
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

| Option | Effect |
|--------|--------|
| `strict` | Enables strict type-checking rules |
| `noUnusedLocals` | Unused local variables are a compile error |
| `noUnusedParameters` | Unused function parameters are a compile error |
| `noFallthroughCasesInSwitch` | Reports errors for fallthrough cases in `switch` |
| `forceConsistentCasingInFileNames` | Enforces consistent file name casing |

These rules prevent common mistakes and keep the codebase consistent when working in a team.

---

## nodemon

`nodemon` watches your project files and restarts the Node process whenever a watched file changes — no manual restarts needed.

Because `nodemon` restarts Node, it watches the **compiled JavaScript output** in `dist/`, not the TypeScript source. Two processes run in parallel:

- `tsc --watch` compiles `src/` → `dist/`
- `nodemon` watches `dist/` and restarts Node when `.js` files change

### tsconfig.json (minimum for nodemon setup)

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true
  }
}
```

### nodemon.json

```json
{
  "watch": ["dist"],
  "exec": "node dist/index.js",
  "ext": "js"
}
```

### Running

```bash
tsc --watch   # terminal 1: watches src/, compiles to dist/
nodemon       # terminal 2: watches dist/, restarts node
```

---

## concurrently — One Terminal for Both Processes

`tsc --watch` and `nodemon` both run indefinitely. You cannot chain them with `&&` because `&&` waits for the first command to finish before starting the second.

`concurrently` runs multiple commands at the same time in a single terminal.

```bash
npm install --save-dev concurrently
```

### package.json

```json
{
  "scripts": {
    "build:watch": "tsc --watch",
    "start:dev": "nodemon dist/index.js",
    "dev": "concurrently \"npm run build:watch\" \"npm run start:dev\""
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "nodemon": "^3.0.1"
  }
}
```

> The quotes around each `npm run` command are escaped with `\"` because the `dev` script value is already wrapped in double quotes.

```bash
npm run dev   # starts both processes, interleaved output in one terminal
```

---

## tsx — The Modern Alternative

`tsx` combines `tsc --watch` and `nodemon` into a single command. It transpiles TypeScript **in memory** using Esbuild and passes the result directly to Node.js — no `dist` folder, no second process, no `concurrently` needed.

```bash
npm install --save-dev tsx
```

### Comparison

| | `tsc + nodemon` | `tsx watch` |
|---|---|---|
| Processes | Two (compiler + server) | One |
| Compilation output | Written to disk | In memory |
| Speed | Slower (disk I/O) | Faster (Esbuild) |
| Module handling | Manual config | Handled automatically |

### package.json

```json
{
  "scripts": {
    "start:dev": "tsx watch src/index.ts",
    "typecheck": "tsc --noEmit --watch"
  },
  "devDependencies": {
    "tsx": "^4.0.0"
  }
}
```

The two scripts are intentionally separate:

- `start:dev` — fast transpile-and-restart loop (no type checking)
- `typecheck` — full type analysis without emitting files; run alongside `start:dev` to catch type errors

### Why tsx is fast

`tsx` uses **Esbuild** under the hood. Esbuild is written in Go and only strips TypeScript types — it does not analyze them. Stripping types is fast; full type checking is slow. Because transpiled output stays in memory, there is no disk read/write overhead between compile and run.

> `tsx` is for server-side code only. Client-side TypeScript still needs `tsc` because `tsx` builds on Node.js.

---

## nodemon + tsx — Advanced File Watching

`tsx watch` covers most projects. Add `nodemon` when you need to:

- Watch files `tsx` ignores by default (e.g. `.env`)
- Exclude specific paths from triggering restarts
- Run custom scripts on restart

In this setup, **nodemon owns file watching** and calls `tsx` as its executor.

```bash
npm install --save-dev tsx nodemon
```

### nodemon.json

```json
{
  "watch": ["src", ".env"],
  "ext": "ts,json,env",
  "ignore": ["src/**/*.test.ts"],
  "exec": "tsx src/index.ts"
}
```

| Option | Purpose |
|--------|---------|
| `watch` | Directories and files to monitor, including `.env` |
| `ext` | File extensions that trigger a restart |
| `ignore` | Paths excluded from triggering restarts (e.g. test files) |
| `exec` | Command nodemon runs on each restart — here, `tsx` instead of `node` |

### package.json

```json
{
  "scripts": {
    "dev": "nodemon"
  }
}
```

`nodemon` reads `nodemon.json` automatically, so the script stays minimal.

---

## When to Use What

| Situation | Tool |
|-----------|------|
| New project, no special requirements | `tsx watch` |
| Need to watch `.env` or non-TS files | `nodemon + tsx` |
| Older codebase or existing setup | `tsc --watch + nodemon + concurrently` |
