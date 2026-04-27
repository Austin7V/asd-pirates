import type { Book } from "../types/types";

const API_URL = "http://localhost:4730/books";

const searchParams = new URLSearchParams(window.location.search);
const bookId = searchParams.get("id");

const bookTitle = document.querySelector<HTMLSpanElement>("#book-title");
const bookSubtitle = document.querySelector<HTMLElement>("#book-subtitle");
const bookAbstract = document.querySelector<HTMLParagraphElement>("#book-abstract");
const bookAuthor = document.querySelector<HTMLSpanElement>("#book-author");
const bookPublisher = document.querySelector<HTMLSpanElement>("#book-publisher");
const bookPages = document.querySelector<HTMLSpanElement>("#book-pages");
const bookCover = document.querySelector<HTMLImageElement>("#book-cover");

async function loadBookDetails() {
    if (!bookId) {
        console.error("No book id found in URL");
        return;
    }

    const response = await fetch(`${API_URL}/${bookId}`);
    const book: Book = await response.json();

    renderBookDetails(book);
}

function renderBookDetails(book: Book) {
    if (bookTitle) {
        bookTitle.textContent = book.title;
    }
    if (bookSubtitle) {
        bookSubtitle.textContent = book.subtitle;
    }
    if (bookAbstract) {
        bookAbstract.textContent = book.abstract;
    }
    if (bookAuthor) {
        bookAuthor.textContent = book.author;
    }
    if (bookPublisher) {
        bookPublisher.textContent = book.publisher;
    }
    if (bookPages) {
        bookPages.textContent = String(book.numPages);
    }
    if (bookCover) {
        bookCover.src = book.cover;
        bookCover.alt = book.title;
    }
}
loadBookDetails();