import type { Book } from "./types";
import { fetchBooks } from "./api";
import { getFavoriteIds } from "./favorite";
import { renderBooks } from "./renderBooks";
import { renderFavoriteCount } from "./renderFavoriteCount";

const bookList = document.querySelector<HTMLTableSectionElement>("#book-list");
const bookCount = document.querySelector<HTMLHeadingElement>("#book-count");
const favoriteCount = document.querySelector<HTMLSpanElement>("#favorite-count");

async function loadFavoriteBooks() {
    const books = await fetchBooks();
    const favoriteIds = getFavoriteIds();

    const favoriteBooks: Book[] = books.filter((book) => {
        return favoriteIds.includes(book.id);
    });

    renderBooks(favoriteBooks, bookList, bookCount, favoriteCount, loadFavoriteBooks);
    renderFavoriteCount(favoriteCount);
}

loadFavoriteBooks();