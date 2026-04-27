import type { Book } from "./types";
import { fetchBooks } from "./api";
import { renderBooks } from "./renderBooks";
import { renderPublisherOptions } from "./renderPublisherOptions";
import { applyFilters } from "./filters";
import { toggleFavoriteId, getFavoriteIds } from "./favorite";
import { renderFavoriteCount } from "./renderFavoriteCount";

toggleFavoriteId("test-book-id");
console.log(getFavoriteIds());

const bookList = document.querySelector<HTMLTableSectionElement>("#book-list");
const bookCount = document.querySelector<HTMLHeadingElement>("#book-count");
const searchInput = document.querySelector<HTMLInputElement>("#search");
const publisherSelect = document.querySelector<HTMLSelectElement>("#by-publisher");
const favoriteCount = document.querySelector<HTMLSpanElement>("#favorite-count");

let allBooks: Book[] = [];

async function loadBooks() {
    const books = await fetchBooks();

    allBooks = books;

    renderPublisherOptions(allBooks, publisherSelect);
    renderBooks(allBooks, bookList, bookCount, favoriteCount);
    renderFavoriteCount(favoriteCount);
}

if (searchInput) {
    searchInput.addEventListener("input", () => {
        filterBooks();
    });
}
if (publisherSelect) {
    publisherSelect.addEventListener("change", () => {
        filterBooks();
    });
}

function filterBooks() {
    const searchText = searchInput ? searchInput.value.toLowerCase() : "";
    const selectedPublisher = publisherSelect ? publisherSelect.value : "";

    const filteredBooks = applyFilters(allBooks, searchText, selectedPublisher);

    renderBooks(filteredBooks, bookList, bookCount, favoriteCount);
}

loadBooks();