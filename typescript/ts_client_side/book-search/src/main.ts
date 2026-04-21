interface Book {
    id: string;
    title: string;
    subtitle: string;
    authors: string;
    image: string;
    url: string;
}

interface SearchResult {
    status: string;
    total: string;
    books: Book[];
}

const form = document.getElementById("search-form") as HTMLFormElement;
const listContainer = document.getElementById("book-list") as HTMLUListElement;

const API_URL = "https://www.dbooks.org/api/search/";

form.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();
    listContainer.innerHTML = "";

    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const query = formData.get("query") as string;

    console.log(query);

    const books = await fetchBooks(query);

    if (!books || books.length === 0) {
        listContainer.append("No books found.");
        return;
    }

    books
        .map((book) => createCard(book))
        .forEach((card) => listContainer.append(card));
});

function createCard(book: Book): HTMLLIElement {
    const container = document.createElement("li");
    container.innerHTML = `
    <h2>${book.title}</h2>
    <p>${book.authors}</p>
    <img src="${book.image}" alt="${book.title}">
    <a href="${book.url}">Read more</a>
    </img>`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => container.remove());
    container.append(deleteBtn);

    return container;
}

async function fetchBooks(term: string): Promise<Book[]> {
    const response = await fetch(API_URL + encodeURIComponent(term));
    const data = (await response.json()) as SearchResult;

    return data.books ?? [];
}

const helloBtn = document.getElementById("helloBtn") as HTMLButtonElement;
const output = document.getElementById("output") as HTMLParagraphElement;

helloBtn.addEventListener("click", () => {
    output.textContent = "Hello from TypeScript!";
});

const nameInput = document.getElementById("nameInput") as HTMLInputElement;
const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
const displayName = document.getElementById("displayName") as HTMLParagraphElement;

submitBtn.addEventListener("click", () => {
    displayName.textContent = nameInput.value;
});

const toggleBtn = document.getElementById("toggleBtn") as HTMLButtonElement;
const hiddenText = document.getElementById("hiddenText") as HTMLParagraphElement;

toggleBtn.addEventListener("click", () => {
    hiddenText.style.display = hiddenText.style.display === "none" ? "" : "none";
});