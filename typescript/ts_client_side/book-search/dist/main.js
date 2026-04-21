"use strict";
const form = document.getElementById("search-form");
const listContainer = document.getElementById("book-list");
const API_URL = "https://www.dbooks.org/api/search/";
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    listContainer.innerHTML = "";
    const formElement = event.target;
    const formData = new FormData(formElement);
    const query = formData.get("query");
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
function createCard(book) {
    const container = document.createElement("li");
    container.innerHTML = `
    <h2>${book.title}</h2>
    <p>${book.authors}</p>
    <img src="${book.image}" alt="${book.title}">
    <a href="${book.url}">Read more</a>
    </img>`;
    return container;
}
async function fetchBooks(term) {
    const response = await fetch(API_URL + encodeURIComponent(term));
    const data = (await response.json());
    return data.books ?? [];
}
const helloBtn = document.getElementById("helloBtn");
const output = document.getElementById("output");
helloBtn.addEventListener("click", () => {
    output.textContent = "Hello from TypeScript!";
});
const nameInput = document.getElementById("nameInput");
const submitBtn = document.getElementById("submitBtn");
const displayName = document.getElementById("displayName");
submitBtn.addEventListener("click", () => {
    displayName.textContent = nameInput.value;
    console.log(nameInput.value);
});
//# sourceMappingURL=main.js.map