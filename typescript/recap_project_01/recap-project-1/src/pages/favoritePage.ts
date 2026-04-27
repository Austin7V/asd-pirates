import type { Book } from "../types/types";
import { fetchBooks } from "../api/api";
import { getFavoriteIds } from "../utils/favorite";
import { renderBooks } from "../render/renderBooks";
import { renderFavoriteCount } from "../render/renderFavoriteCount";

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