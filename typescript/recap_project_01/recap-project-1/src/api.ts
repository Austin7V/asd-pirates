import type { Book } from "./types";

const API_URL = "http://localhost:4730/books";

export async function fetchBooks() {
    const response = await fetch(API_URL);
    const books: Book[] = await response.json();

    return books;
}