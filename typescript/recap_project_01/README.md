# IT-Book Library

## Introduction

The customer is a library focused on IT books in the fictitious city of **Foobar Town**. The library wants to make its books available online to give customers the possibility to save their favorite books in a list.

Your task is to create this app for the customer.

---

## Prerequisites

### Starter Files

Download the starter files for this challenge:

```bash
npx ghcd@latest wd-bootcamp/asd-challenges/tree/main/challenges/recap-project-1 recap-project-1
```

### REST API

The REST API is available via the `bookmonkey-api` package. Follow the instructions to start the API server on your local machine:

```bash
npx bookmonkey-api
```

More info: https://www.npmjs.com/package/bookmonkey-api

### HTML Templates

The HTML pages for the project are already pre-designed. You'll find them in the `src/` directory. Use these HTML files as templates and only add your TypeScript — do not replace the structure.

---

## Tasks

Use plain TypeScript for all DOM manipulation. Do not use any component library.

### Setup

- [ ] Create `tsconfig.json` and `package.json` configuration files
- [ ] Create a TypeScript file for each HTML page
- [ ] Fetch all book data from the REST API

---

### Feature 1 — Filterable Book Listing

Display all books in a table with the following columns per row:

- Title
- ISBN
- Author
- Publisher

- [ ] Implement search by title
- [ ] Implement filter to show only books from a specific publisher

---

### Feature 2 — Book Detail Page

- [ ] Display all required book information from `src/detail.html`
- [ ] Make the detail page accessible from the list view (link per book row)

---

### Feature 3 — Favorites List

- [ ] Add a book as a favorite from the list view
- [ ] Show the favorites list in the application header
- [ ] Display the count of favorite books in the header
- [ ] Allow removing a book from favorites
- [ ] Persist favorites in the browser (`localStorage`) so they survive page reloads

---

## Stack

- TypeScript (plain, no frameworks)
- Browser DOM API
- Fetch API
- localStorage
- bookmonkey REST API (local)
