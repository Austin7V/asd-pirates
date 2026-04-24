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

async function loadBooks() {
    const response = await fetch(API_URL);
    const books: Book[] = await response.json();
    console.log(books);
}
loadBooks();