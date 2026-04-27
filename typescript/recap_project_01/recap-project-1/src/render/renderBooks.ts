import type {Book} from "../types/types";
import { isFavorite, toggleFavoriteId } from "../utils/favorite";
import { renderFavoriteCount } from "./renderFavoriteCount";

export function renderBooks(
    books: Book[],
    bookList: HTMLTableSectionElement | null = document.querySelector("#book-list"),
    bookCount: HTMLHeadingElement | null = document.querySelector("#book-count"),
    favoriteCount: HTMLSpanElement | null = document.querySelector("#favorite-count"),
onFavoriteChange?: () => void
) {
    if (!bookList) {
        return;
    }
    if (bookCount) {
        bookCount.textContent = `${books.length} Books displayed`;
    }
    bookList.innerHTML = "";
    for (const book of books) {
        const row = document.createElement("tr");

        const favoriteCell = document.createElement("td");
        const favoriteButton = document.createElement("button");

        favoriteButton.className = "button button-clear fav-btn";
        favoriteButton.textContent = isFavorite(book.id) ? "♥" : "♡";
        favoriteButton.addEventListener("click", () => {
            toggleFavoriteId(book.id);
            favoriteButton.textContent = isFavorite(book.id) ? "♥" : "♡";
            renderFavoriteCount(favoriteCount);
            if (onFavoriteChange) {
                onFavoriteChange();
            }
        });
        favoriteCell.append(favoriteButton);

        const titleCell = document.createElement("td");
        titleCell.textContent = book.title;

        const isbnCell = document.createElement("td");
        isbnCell.textContent = book.isbn;

        const authorCell = document.createElement("td");
        authorCell.textContent = book.author;

        const publisherCell = document.createElement("td");
        publisherCell.textContent = book.publisher;

        const detailCell = document.createElement("td");
        const detailButton = document.createElement("button");
        detailButton.className = "button";
        detailButton.textContent = "Detail";
        detailButton.addEventListener("click", () => document.location.href = `detail.html?id=${book.id}`)
        detailCell.append(detailButton);

        row.append(
            favoriteCell,
            titleCell,
            isbnCell,
            authorCell,
            publisherCell,
            detailCell
        );

        bookList.append(row);
    }
}
