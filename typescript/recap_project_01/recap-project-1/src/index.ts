type Book = {
    id: string;
    title: string;
    subtitle: string;
    isbn: string;
    abstract: string;
    author: string;
    publisher: string;
    price: string;
    numPages: number;
    cover: string;
    userId: number;
}

const API_URL = "http://localhost:4730/books";
const bookList = document.querySelector<HTMLTableSectionElement>("#book-list");
const bookCount = document.querySelector<HTMLHeadingElement>("#book-count");
const searchInput = document.querySelector<HTMLInputElement>("#search");
let allBooks: Book[] = [];

async function loadBooks() {
    const response = await fetch(API_URL);
    const books: Book[] = await response.json();

    allBooks = books;

    console.log(allBooks);
    renderBooks(allBooks);
}

function renderBooks(books: Book[]) {
    if (!bookList) {
        return;
    }
    bookList.innerHTML = "";
    if (searchInput) {
        searchInput.addEventListener("input", ()=> {
            const searchText = searchInput.value.toLowerCase();
            const filteredBooks = allBooks.filter((book) => {
                return book.title.toLowerCase().includes(searchText) || book.author.toLowerCase().includes(searchText);
            });
            renderBooks(filteredBooks);
        });
    }
    if (bookCount) {
        bookCount.textContent = `${books.length} Books displayed`;
    }
    for (const book of books) {
        const row = document.createElement("tr");

        const favoriteCell = document.createElement("td");
        const favoriteButton = document.createElement("button");
        favoriteButton.className = "button button-clear fav-btn";
        favoriteButton.textContent = "";
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

loadBooks()
