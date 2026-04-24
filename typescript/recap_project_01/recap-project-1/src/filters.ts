import type { Book } from "./types";

export function applyFilters(
    allBooks: Book[],
    searchText: string,
    selectedPublisher: string
) {
    let filteredBooks = allBooks;

    if (searchText !== "") {
        filteredBooks = filteredBooks.filter((book) => {
            return (
                book.title.toLowerCase().includes(searchText) ||
                book.author.toLowerCase().includes(searchText)
            );
        });
    }

    if (selectedPublisher !== "") {
        filteredBooks = filteredBooks.filter((book) => {
            return book.publisher === selectedPublisher;
        });
    }

    return filteredBooks;
}