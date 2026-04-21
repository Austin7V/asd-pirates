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
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => container.remove());
    container.append(deleteBtn);
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
});
const toggleBtn = document.getElementById("toggleBtn");
const hiddenText = document.getElementById("hiddenText");
toggleBtn.addEventListener("click", () => {
    hiddenText.style.display = hiddenText.style.display === "none" ? "" : "none";
});
const decreaseBtn = document.getElementById("decreaseBtn");
const counterDisplay = document.getElementById("counter");
const increaseBtn = document.getElementById("increaseBtn");
let count = 0;
decreaseBtn.addEventListener("click", () => {
    count -= 1;
    counterDisplay.textContent = String(count);
});
increaseBtn.addEventListener("click", () => {
    count += 1;
    counterDisplay.textContent = String(count);
});
const colorSelect = document.getElementById("colorSelect");
const colorBox = document.getElementById("colorBox");
colorSelect.addEventListener("change", (event) => {
    const select = event.target;
    colorBox.style.backgroundColor = select.value;
});
const textInput = document.getElementById("textInput");
const charCount = document.getElementById("charCount");
textInput.addEventListener("input", () => {
    charCount.textContent = `${textInput.value.length} characters`;
});
const todoInput = document.getElementById("todoInput");
const addTodoBtn = document.getElementById("addTodo");
const todoList = document.getElementById("todoList");
function createTodoItem(text) {
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
    if (!text)
        return;
    todoList.append(createTodoItem(text));
    todoInput.value = "";
});
//# sourceMappingURL=main.js.map