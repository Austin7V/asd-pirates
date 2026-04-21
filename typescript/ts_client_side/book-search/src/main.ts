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

const decreaseBtn = document.getElementById("decreaseBtn") as HTMLButtonElement;
const counterDisplay = document.getElementById("counter") as HTMLSpanElement;
const increaseBtn = document.getElementById("increaseBtn") as HTMLButtonElement;

let count = 0;

decreaseBtn.addEventListener("click", () => {
    count -= 1;
    counterDisplay.textContent = String(count);
});

increaseBtn.addEventListener("click", () => {
    count += 1;
    counterDisplay.textContent = String(count);
});

const colorSelect = document.getElementById("colorSelect") as HTMLSelectElement;
const colorBox = document.getElementById("colorBox") as HTMLDivElement;

colorSelect.addEventListener("change", (event: Event) => {
    const select = event.target as HTMLSelectElement;
    colorBox.style.backgroundColor = select.value;
});

const textInput = document.getElementById("textInput") as HTMLTextAreaElement;
const charCount = document.getElementById("charCount") as HTMLParagraphElement;

textInput.addEventListener("input", () => {
    charCount.textContent = `${textInput.value.length} characters`;
});

const todoInput = document.getElementById("todoInput") as HTMLInputElement;
const addTodoBtn = document.getElementById("addTodo") as HTMLButtonElement;
const todoList = document.getElementById("todoList") as HTMLUListElement;

function createTodoItem(text: string): HTMLLIElement {
    const item = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () => {
        label.style.textDecoration = checkbox.checked ? "line-through" : "";
    });

    const label = document.createElement("span");
    label.textContent = text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => item.remove());

    item.append(checkbox, label, deleteBtn);
    return item;
}

addTodoBtn.addEventListener("click", () => {
    const text = todoInput.value.trim();
    if (!text) return;

    todoList.append(createTodoItem(text));
    todoInput.value = "";
});